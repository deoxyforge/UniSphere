# UniSphere Database Schema

## Connection

MongoDB Atlas cluster. All _id fields are strings (ObjectId.toString() for compatibility).

---

## User

| Field | Type | Notes |
|-------|------|-------|
| _id | String | UUID |
| name | String | required |
| email | String | unique, lowercase |
| password | String | bcrypt hashed |
| role | String | Student/Faculty/Admin |
| department | String | optional |
| profileImage | String | URL or upload path |
| biography | String | optional |
| skills | [String] | array |
| interests | [String] | array, used for AI scoring |
| joinedClubs | [String] | ref Club._id |
| createdAt/updatedAt | Date | timestamps |

## Event

| Field | Type | Notes |
|-------|------|-------|
| _id | String | |
| title | String | required |
| description | String | required |
| category | String | Tech/Sports/Arts/etc |
| venue | String | required |
| date | String | ISO date |
| time | String | HH:MM |
| banner | String | URL or /uploads path |
| capacity | Number | max registrations |
| registeredStudents | [String] | ref User._id |
| organizer | String | ref User._id (Faculty/Admin) |
| status | String | pending/approved/rejected |
| createdAt/updatedAt | Date | timestamps |

## Club

| Field | Type | Notes |
|-------|------|-------|
| _id | String | |
| name | String | required, unique |
| description | String | |
| category | String | |
| logo | String | image URL |
| coordinator | String | ref User._id (Faculty) |
| members | [String] | ref User._id |
| createdAt/updatedAt | Date | timestamps |

## Registration

| Field | Type | Notes |
|-------|------|-------|
| _id | String | |
| student | String | ref User._id |
| event | String | ref Event._id |
| status | String | registered/cancelled |
| qrData | String | unique QR identifier |
| createdAt | Date | timestamp |

## Attendance

| Field | Type | Notes |
|-------|------|-------|
| _id | String | |
| student | String | ref User._id |
| event | String | ref Event._id |
| attended | Boolean | default false |
| markedBy | String | ref User._id (Faculty/Admin) |
| createdAt | Date | timestamp |

## Notification

| Field | Type | Notes |
|-------|------|-------|
| _id | String | |
| user | String | ref User._id (recipient) |
| message | String | |
| type | String | info/success/warning |
| read | Boolean | default false |
| createdAt | Date | timestamp |

## Indexes

User: email (unique)
Event: organizer, status, date
Registration: student+event (unique together to prevent duplicates)
Attendance: student+event (unique)
Notification: user, read

