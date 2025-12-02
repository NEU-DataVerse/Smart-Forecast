---
sidebar_position: 9
title: Files API
---

# Files API

API upload và quản lý files (lưu trữ trên MinIO).

---

## Upload ảnh đơn

```http
POST /api/v1/files/upload
Authorization: Bearer <USER_TOKEN>
Content-Type: multipart/form-data

file: [image file]
```

**Supported formats:** jpg, jpeg, png, gif, webp

**Max size:** 5MB

**Response:**

```json
{
  "url": "https://minio.example.com/bucket/filename.jpg",
  "filename": "filename.jpg",
  "originalName": "my-photo.jpg",
  "size": 102400,
  "mimeType": "image/jpeg"
}
```

---

## Upload nhiều ảnh

```http
POST /api/v1/files/upload-multiple
Authorization: Bearer <USER_TOKEN>
Content-Type: multipart/form-data

files: [image1.jpg, image2.jpg, ...]
```

**Max files:** 5 files per request

**Response:**

```json
{
  "files": [
    {
      "url": "https://minio.example.com/bucket/file1.jpg",
      "filename": "file1.jpg",
      "size": 102400
    },
    {
      "url": "https://minio.example.com/bucket/file2.jpg",
      "filename": "file2.jpg",
      "size": 98765
    }
  ],
  "total": 2
}
```

---

## Lưu ý

:::info MinIO Storage

- Files được lưu trữ trên MinIO Object Storage
- URL có thể access public hoặc cần signed URL tùy cấu hình
- Files tự động được đặt tên unique để tránh trùng lặp
  :::
