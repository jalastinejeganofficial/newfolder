from fastapi import FastAPI, HTTPException, Depends, status, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime, timedelta
import uvicorn
import os

# Database simulation (in production, use real database)
users_db = []
feedbacks_db = []

app = FastAPI(
    title="VeritasAI Community API",
    description="Authentication and Community Features for VeritasAI",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Models
class UserRegister(BaseModel):
    username: str
    email: str
    password: str
    full_name: Optional[str] = None

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    full_name: Optional[str] = None
    created_at: datetime
    last_login: Optional[datetime] = None

class FeedbackCreate(BaseModel):
    title: str
    content: str
    category: str = "general"
    is_anonymous: bool = False

class FeedbackResponse(BaseModel):
    id: int
    title: str
    content: str
    category: str
    author_username: str
    is_anonymous: bool
    created_at: datetime
    upvotes: int = 0
    replies: List[dict] = []

class ReplyCreate(BaseModel):
    content: str
    feedback_id: int

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

# Simple token generation (use JWT in production)
def create_access_token(user_id: int, username: str) -> str:
    return f"token_{user_id}_{username}_{datetime.now().timestamp()}"

# Security scheme
security = HTTPBearer(auto_error=False)

# Authentication dependency
async def get_current_user(authorization: str = Header(None, alias="Authorization")):
    # Handle both "Bearer token" and direct token
    print(f"\n=== AUTH DEBUG ===")
    print(f"Authorization header received: {authorization}")
    
    token = authorization
    if authorization and authorization.startswith("Bearer "):
        token = authorization.replace("Bearer ", "")
    
    print(f"Extracted token: {token}")
    
    if not token or not token.startswith("token_"):
        print(f"❌ Token validation failed: {'Empty token' if not token else 'Wrong format'}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Extract user_id from token
    try:
        parts = token.split("_")
        print(f"Token parts: {parts}")
        
        if len(parts) < 3:
            raise ValueError("Invalid token format")
        user_id = int(parts[1])
        
        # Find user
        user = next((u for u in users_db if u["id"] == user_id), None)
        if not user:
            print(f"❌ User not found with ID: {user_id}")
            raise HTTPException(status_code=404, detail="User not found")
        
        print(f"✅ Authenticated user: {user['username']}")
        print(f"==================\n")
        return user
    except Exception as e:
        print(f"❌ Auth error: {e}")
        print(f"==================\n")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )

# Routes
@app.post("/api/auth/register", response_model=UserResponse)
async def register(user_data: UserRegister):
    """Register a new user"""
    
    # Check if username already exists
    if any(u["username"] == user_data.username for u in users_db):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )
    
    # Check if email already exists
    if any(u["email"] == user_data.email for u in users_db):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    new_user = {
        "id": len(users_db) + 1,
        "username": user_data.username,
        "email": user_data.email,
        "password": user_data.password,  # In production, hash this!
        "full_name": user_data.full_name,
        "created_at": datetime.now(),
        "last_login": None
    }
    
    users_db.append(new_user)
    
    # Return user without password
    return {k: v for k, v in new_user.items() if k != "password"}

@app.post("/api/auth/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    """Login user and return token"""
    
    # Find user
    user = next((u for u in users_db if u["username"] == credentials.username), None)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )
    
    # Verify password
    if user["password"] != credentials.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )
    
    # Update last login
    user["last_login"] = datetime.now()
    
    # Generate token
    token = create_access_token(user["id"], user["username"])
    
    # Return user without password
    user_without_password = {k: v for k, v in user.items() if k != "password"}
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user_without_password
    }

@app.get("/api/auth/me", response_model=UserResponse)
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    """Get current user information"""
    return {k: v for k, v in current_user.items() if k != "password"}

@app.post("/api/community/feedback", response_model=FeedbackResponse)
async def create_feedback(
    feedback_data: FeedbackCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create new feedback (requires authentication)"""
    
    new_feedback = {
        "id": len(feedbacks_db) + 1,
        "title": feedback_data.title,
        "content": feedback_data.content,
        "category": feedback_data.category,
        "author_username": current_user["username"] if not feedback_data.is_anonymous else "Anonymous",
        "is_anonymous": feedback_data.is_anonymous,
        "created_at": datetime.now(),
        "upvotes": 0,
        "replies": []
    }
    
    feedbacks_db.append(new_feedback)
    return new_feedback

@app.get("/api/community/feedback", response_model=List[FeedbackResponse])
async def get_all_feedback():
    """Get all feedback (public - no authentication required)"""
    return sorted(feedbacks_db, key=lambda x: x["created_at"], reverse=True)

@app.get("/api/community/feedback/{feedback_id}", response_model=FeedbackResponse)
async def get_feedback(feedback_id: int):
    """Get specific feedback by ID"""
    feedback = next((f for f in feedbacks_db if f["id"] == feedback_id), None)
    
    if not feedback:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Feedback not found"
        )
    
    return feedback

@app.post("/api/community/feedback/{feedback_id}/reply")
async def reply_to_feedback(
    feedback_id: int,
    reply_data: ReplyCreate,
    current_user: dict = Depends(get_current_user)
):
    """Reply to feedback (requires authentication)"""
    
    # Find feedback
    feedback = next((f for f in feedbacks_db if f["id"] == feedback_id), None)
    
    if not feedback:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Feedback not found"
        )
    
    # Create reply
    new_reply = {
        "id": len(feedback["replies"]) + 1,
        "content": reply_data.content,
        "author_username": current_user["username"],
        "created_at": datetime.now().isoformat()
    }
    
    feedback["replies"].append(new_reply)
    
    return {
        "message": "Reply added successfully",
        "reply": new_reply
    }

@app.post("/api/community/feedback/{feedback_id}/upvote")
async def upvote_feedback(
    feedback_id: int,
    current_user: dict = Depends(get_current_user)
):
    """Upvote feedback (requires authentication)"""
    
    # Find feedback
    feedback = next((f for f in feedbacks_db if f["id"] == feedback_id), None)
    
    if not feedback:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Feedback not found"
        )
    
    # Increment upvote
    feedback["upvotes"] += 1
    
    return {
        "message": "Feedback upvoted",
        "upvotes": feedback["upvotes"]
    }

@app.delete("/api/community/feedback/{feedback_id}")
async def delete_feedback(
    feedback_id: int,
    current_user: dict = Depends(get_current_user)
):
    """Delete own feedback"""
    
    # Find feedback
    feedback = next((f for f in feedbacks_db if f["id"] == feedback_id), None)
    
    if not feedback:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Feedback not found"
        )
    
    # Check ownership
    if feedback["author_username"] != current_user["username"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete your own feedback"
        )
    
    # Remove feedback
    feedbacks_db.remove(feedback)
    
    return {"message": "Feedback deleted successfully"}

@app.get("/api/community/stats")
async def get_community_stats():
    """Get community statistics"""
    return {
        "total_users": len(users_db),
        "total_feedbacks": len(feedbacks_db),
        "recent_activity": len([f for f in feedbacks_db if (datetime.now() - f["created_at"]).days < 7])
    }

# Health check
@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "version": "1.0.0"}

if __name__ == "__main__":
    print("🚀 Starting VeritasAI Community Server...")
    print("📍 Server running at http://localhost:8000")
    print("📝 API docs available at http://localhost:8000/docs")
    print("\nAvailable endpoints:")
    print("  POST /api/auth/register - Register new user")
    print("  POST /api/auth/login - Login user")
    print("  GET  /api/community/feedback - Get all feedback")
    print("  POST /api/community/feedback - Create feedback (auth required)")
    print("  POST /api/community/feedback/{id}/reply - Reply to feedback (auth required)")
    uvicorn.run(app, host="0.0.0.0", port=8000)
