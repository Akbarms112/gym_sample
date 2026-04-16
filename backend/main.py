from fastapi import FastAPI, HTTPException, Depends, status
from dotenv import load_dotenv

load_dotenv()
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime, timedelta
from passlib.context import CryptContext
import jwt
import os
from bson import ObjectId
import certifi
import ssl

# Configuration
SECRET_KEY = "your-secret-key-change-this-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

# MongoDB connection
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = "challenge_fitness_db"

# Password hashing
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Initialize FastAPI
app = FastAPI(title="Challenge Fitness Gym API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database client
db_client: Optional[AsyncIOMotorClient] = None

# Pydantic Models
class UserBase(BaseModel):
    email: EmailStr
    name: str
    phone: str
    gender: str

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    phone: str
    gender: str
    role: str
    created_at: datetime

class MembershipCreate(BaseModel):
    plan_id: str
    plan_name: str
    amount: int
    duration_days: int
    payment_method: str

class MembershipResponse(BaseModel):
    id: str
    user_id: str
    plan_id: str
    plan_name: str
    amount: int
    duration_days: int
    start_date: datetime
    end_date: datetime
    payment_method: str
    status: str
    created_at: datetime

class NotificationResponse(BaseModel):
    id: str
    type: str
    title: str
    message: str
    read: bool
    created_at: datetime

# Challenge Models
class ChallengeBase(BaseModel):
    title: str
    description: str
    difficulty: str  # e.g., Beginner, Intermediate, Advanced
    duration_days: int
    points: int

class ChallengeCreate(ChallengeBase):
    pass

class ChallengeResponse(ChallengeBase):
    id: str
    participants_count: int = 0
    created_at: datetime

# Plan Models
class PlanBase(BaseModel):
    plan_id: str
    plan_name: str
    description: Optional[str] = None
    amount: int
    duration_days: int
    features: List[str]

class PlanCreate(PlanBase):
    pass

class PlanResponse(PlanBase):
    id: str
    active: bool = True
    created_at: datetime

# Database connection events
@app.on_event("startup")
async def startup_db_client():
    global db_client
    # Determine if we are connecting to Atlas (remote) or local
    # If the URL contains 'mongodb.net', it's likely Atlas and needs SSL config
    if "mongodb.net" in MONGODB_URL:
        db_client = AsyncIOMotorClient(
            MONGODB_URL, 
            tls=True,
            tlsCAFile=certifi.where(),
            tlsAllowInvalidCertificates=True  # Uncomment if dealing with self-signed certs or strict firewalls temporarily
        )
    else:
        db_client = AsyncIOMotorClient(MONGODB_URL)
    
    # Create indexes
    await db_client[DATABASE_NAME].users.create_index("email", unique=True)
    await db_client[DATABASE_NAME].memberships.create_index("user_id")
    await db_client[DATABASE_NAME].challenges.create_index("title")
    await db_client[DATABASE_NAME].plans.create_index("plan_id", unique=True)
    
    # Create default admin if not exists
    admin_exists = await db_client[DATABASE_NAME].users.find_one({"role": "admin"})
    if not admin_exists:
        admin = {
            "email": "admin@challengefitness.com",
            "password": pwd_context.hash("admin123"),
            "name": "Admin",
            "phone": "0000000000",
            "gender": "male",
            "role": "admin",
            "created_at": datetime.utcnow()
        }
        await db_client[DATABASE_NAME].users.insert_one(admin)
        print("Default admin created: admin@challengefitness.com / admin123")

@app.on_event("shutdown")
async def shutdown_db_client():
    global db_client
    if db_client:
        db_client.close()

# Helper functions
def get_db():
    return db_client[DATABASE_NAME]

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception
    
    db = get_db()
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if user is None:
        raise credentials_exception
    return user

async def get_current_admin(current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    return current_user

async def create_notification(db, notification_type: str, title: str, message: str, user_id: str = None):
    notification = {
        "type": notification_type,
        "title": title,
        "message": message,
        "read": False,
        "created_at": datetime.utcnow()
    }
    if user_id:
        notification["user_id"] = user_id
    await db.notifications.insert_one(notification)

# Routes
@app.get("/")
async def root():
    return {"message": "Challenge Fitness Gym API", "status": "running"}

# User Authentication Routes
@app.post("/api/user/register")
async def register_user(user: UserCreate):
    db = get_db()
    
    # Check if user exists
    existing_user = await db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    user_dict = user.dict()
    user_dict["password"] = get_password_hash(user_dict["password"])
    user_dict["role"] = "user"
    user_dict["created_at"] = datetime.utcnow()
    
    result = await db.users.insert_one(user_dict)
    
    # Create notification for admin
    await create_notification(
        db,
        "new_member",
        "New Member Registered",
        f"{user.name} has registered and joined the gym!"
    )
    
    return {"message": "User registered successfully", "user_id": str(result.inserted_id)}

@app.post("/api/user/login")
async def login_user(credentials: UserLogin):
    db = get_db()
    user = await db.users.find_one({"email": credentials.email})
    
    if not user or not verify_password(credentials.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if user["role"] != "user":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    access_token = create_access_token({"sub": str(user["_id"])})
    
    user_response = {
        "id": str(user["_id"]),
        "email": user["email"],
        "name": user["name"],
        "phone": user["phone"],
        "gender": user["gender"],
        "role": user["role"],
        "created_at": user["created_at"]
    }
    
    return {"token": access_token, "user": user_response}

@app.post("/api/admin/login")
async def login_admin(credentials: UserLogin):
    db = get_db()
    user = await db.users.find_one({"email": credentials.email})
    
    if not user or not verify_password(credentials.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    access_token = create_access_token({"sub": str(user["_id"])})
    
    user_response = {
        "id": str(user["_id"]),
        "email": user["email"],
        "name": user["name"],
        "phone": user["phone"],
        "gender": user["gender"],
        "role": user["role"],
        "created_at": user["created_at"]
    }
    
    return {"token": access_token, "user": user_response}

# User Membership Routes
@app.get("/api/user/membership")
async def get_user_membership(current_user: dict = Depends(get_current_user)):
    db = get_db()
    membership = await db.memberships.find_one({
        "user_id": str(current_user["_id"]),
        "status": {"$in": ["active", "pending"]}
    })
    
    if not membership:
        return None
    
    return {
        "id": str(membership["_id"]),
        "user_id": membership["user_id"],
        "plan_id": membership["plan_id"],
        "plan_name": membership["plan_name"],
        "amount": membership["amount"],
        "duration_days": membership["duration_days"],
        "start_date": membership["start_date"],
        "end_date": membership["end_date"],
        "payment_method": membership["payment_method"],
        "status": membership["status"],
        "created_at": membership["created_at"]
    }

@app.post("/api/user/subscribe")
async def subscribe_user(
    membership_data: MembershipCreate,
    current_user: dict = Depends(get_current_user)
):
    db = get_db()
    
    # Check if user already has active or pending membership
    existing = await db.memberships.find_one({
        "user_id": str(current_user["_id"]),
        "status": {"$in": ["active", "pending"]}
    })
    
    if existing:
        if existing["status"] == "pending":
            raise HTTPException(status_code=400, detail="You already have a pending membership request")
        raise HTTPException(status_code=400, detail="You already have an active membership")
    
    # Create membership
    # Create membership (pending approval)
    # start_date and end_date will be set upon approval
    
    membership = {
        "user_id": str(current_user["_id"]),
        "user_name": current_user["name"],
        "plan_id": membership_data.plan_id,
        "plan_name": membership_data.plan_name,
        "amount": membership_data.amount,
        "duration_days": membership_data.duration_days,
        "start_date": None,
        "end_date": None,
        "payment_method": membership_data.payment_method,
        "status": "pending",
        "created_at": datetime.utcnow()
    }
    
    result = await db.memberships.insert_one(membership)
    
    # Create notification for admin
    await create_notification(
        db,
        "new_subscription",
        "New Membership Purchase",
        f"{current_user['name']} has purchased {membership_data.plan_name} for ₹{membership_data.amount}"
    )
    
    membership["id"] = str(result.inserted_id)
    if "_id" in membership:
        del membership["_id"]
    return membership

# Admin Routes
@app.get("/api/admin/members")
async def get_all_members(current_admin: dict = Depends(get_current_admin)):
    db = get_db()
    members = []
    
    async for user in db.users.find({"role": "user"}):
        members.append({
            "id": str(user["_id"]),
            "email": user["email"],
            "name": user["name"],
            "phone": user["phone"],
            "gender": user["gender"],
            "created_at": user["created_at"]
        })
    
    return members

@app.delete("/api/admin/users/{user_id}")
async def delete_user(user_id: str, current_admin: dict = Depends(get_current_admin)):
    db = get_db()
    
    # Check if user exists
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    # Delete user
    await db.users.delete_one({"_id": ObjectId(user_id)})
    
    # Delete user's memberships
    await db.memberships.delete_many({"user_id": user_id})
    
    # Delete user's notifications
    await db.notifications.delete_many({"user_id": user_id})
    
    return {"message": "User deleted successfully"}

@app.delete("/api/admin/users/{user_id}/membership")
async def delete_user_membership(user_id: str, current_admin: dict = Depends(get_current_admin)):
    db = get_db()
    
    # Check if user exists
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    # Delete user's memberships
    result = await db.memberships.delete_many({"user_id": user_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="No memberships found for this user")
    
    # Notify user
    await create_notification(
        db,
        "membership_cancelled",
        "Membership Cancelled",
        "Your membership has been cancelled by the administrator.",
        user_id=user_id
    )
    
    return {"message": "User memberships deleted successfully"}

@app.get("/api/admin/memberships")
async def get_all_memberships(current_admin: dict = Depends(get_current_admin)):
    db = get_db()
    memberships = []
    
    async for membership in db.memberships.find().sort("created_at", -1):
        memberships.append({
            "id": str(membership["_id"]),
            "user_id": membership["user_id"],
            "plan_id": membership["plan_id"],
            "plan_name": membership["plan_name"],
            "amount": membership["amount"],
            "duration_days": membership["duration_days"],
            "start_date": membership["start_date"],
            "end_date": membership["end_date"],
            "payment_method": membership["payment_method"],
            "status": membership["status"],
            "created_at": membership["created_at"]
        })
    
    return memberships

@app.get("/api/plans")
async def get_plans():
    db = get_db()
    plans = []
    # Fetch all plans, assuming if 'active' field is missing it's active
    async for plan in db.plans.find():
        # Check active status if field exists
        if "active" in plan and not plan["active"]:
            continue
            
        plans.append({
            "id": str(plan["_id"]),
            "plan_id": plan.get("plan_id", ""),
            "plan_name": plan.get("plan_name", ""),
            "description": plan.get("description", ""),
            "amount": plan.get("amount", 0),
            "duration_days": plan.get("duration_days", 30),
            "features": plan.get("features", []),
            "active": plan.get("active", True),
            "created_at": plan.get("created_at", datetime.utcnow())
        })
    return plans

@app.put("/api/admin/membership/{membership_id}/approve")
async def approve_membership(membership_id: str, current_admin: dict = Depends(get_current_admin)):
    db = get_db()
    
    membership = await db.memberships.find_one({"_id": ObjectId(membership_id)})
    if not membership:
        raise HTTPException(status_code=404, detail="Membership not found")
    
    if membership["status"] == "active":
        return {"message": "Membership is already active"}
        
    start_date = datetime.utcnow()
    end_date = start_date + timedelta(days=membership["duration_days"])
    
    await db.memberships.update_one(
        {"_id": ObjectId(membership_id)},
        {
            "$set": {
                "status": "active",
                "start_date": start_date,
                "end_date": end_date
            }
        }
    )
    
    # Notify user
    user = await db.users.find_one({"_id": ObjectId(membership["user_id"])})
    if user:
        await create_notification(
            db,
            "membership_approved",
            "Membership Approved",
            f"Your {membership['plan_name']} membership has been approved and is now active!",
            user_id=str(user["_id"])
        )
            
    return {"message": "Membership approved successfully"}

@app.put("/api/admin/membership/{membership_id}/reject")
async def reject_membership(membership_id: str, current_admin: dict = Depends(get_current_admin)):
    db = get_db()
    
    membership = await db.memberships.find_one({"_id": ObjectId(membership_id)})
    if not membership:
        raise HTTPException(status_code=404, detail="Membership not found")
        
    await db.memberships.update_one(
        {"_id": ObjectId(membership_id)},
        {
            "$set": {
                "status": "rejected"
            }
        }
    )
    
    # Notify user
    user = await db.users.find_one({"_id": ObjectId(membership["user_id"])})
    if user:
        await create_notification(
            db,
            "membership_rejected",
            "Membership Rejected",
            f"Your request for {membership['plan_name']} membership was not approved.",
            user_id=str(user["_id"])
        )
            
    return {"message": "Membership rejected"}

@app.get("/api/admin/notifications")
async def get_notifications(current_admin: dict = Depends(get_current_admin)):
    db = get_db()
    notifications = []
    
    # Get regular notifications (filter out user-specific ones)
    async for notif in db.notifications.find({"user_id": {"$exists": False}}).sort("created_at", -1):
        notifications.append({
            "id": str(notif["_id"]),
            "type": notif["type"],
            "title": notif["title"],
            "message": notif["message"],
            "read": notif["read"],
            "created_at": notif["created_at"]
        })
    
    # Check for expiring memberships and create notifications
    today = datetime.utcnow()
    warning_date = today + timedelta(days=7)
    
    async for membership in db.memberships.find({"status": "active"}):
        end_date = membership["end_date"]
        days_remaining = (end_date - today).days
        
        # Check if notification already exists for this membership
        existing_notif = await db.notifications.find_one({
            "type": {"$in": ["expiring_soon", "expired"]},
            "message": {"$regex": membership["plan_name"]}
        })
        
        if not existing_notif:
            user = await db.users.find_one({"_id": ObjectId(membership["user_id"])})
            
            if days_remaining <= 0:
                await create_notification(
                    db,
                    "expired",
                    "Membership Expired",
                    f"{user['name']}'s {membership['plan_name']} has expired"
                )
            elif days_remaining <= 7:
                await create_notification(
                    db,
                    "expiring_soon",
                    "Membership Expiring Soon",
                    f"{user['name']}'s {membership['plan_name']} expires in {days_remaining} days"
                )
    
    # Reload notifications after creating new ones
    notifications = []
    async for notif in db.notifications.find({"user_id": {"$exists": False}}).sort("created_at", -1):
        notifications.append({
            "id": str(notif["_id"]),
            "type": notif["type"],
            "title": notif["title"],
            "message": notif["message"],
            "read": notif["read"],
            "created_at": notif["created_at"]
        })
    
    return notifications

@app.put("/api/admin/notifications/{notification_id}/read")
async def mark_notification_read(
    notification_id: str,
    current_admin: dict = Depends(get_current_admin)
):
    db = get_db()
    result = await db.notifications.update_one(
        {"_id": ObjectId(notification_id)},
        {"$set": {"read": True}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    return {"message": "Notification marked as read"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
