#!/bin/bash
RECORDING_DIR=$1

echo "Finalize recording script started for $RECORDING_DIR"

if [ -z "$MINIO_ENDPOINT" ]; then
    echo "MINIO_ENDPOINT is not set. Skipping MinIO upload."
    exit 0
fi

# Ensure bucket exists or create it using rclone
echo "Uploading $RECORDING_DIR to MinIO..."
export RCLONE_CONFIG_MINIO_TYPE=s3
export RCLONE_CONFIG_MINIO_PROVIDER=Minio
export RCLONE_CONFIG_MINIO_ENV_AUTH=false
export RCLONE_CONFIG_MINIO_ACCESS_KEY_ID=$MINIO_ACCESS_KEY
export RCLONE_CONFIG_MINIO_SECRET_ACCESS_KEY=$MINIO_SECRET_KEY
export RCLONE_CONFIG_MINIO_ENDPOINT=$MINIO_ENDPOINT

# Find the mp4 file inside RECORDING_DIR
MP4_FILE=$(find "$RECORDING_DIR" -name "*.mp4" | head -n 1)

if [ -f "$MP4_FILE" ]; then
    FILENAME=$(basename "$MP4_FILE")
    echo "Found video file: $FILENAME"
    
    # Pattern 1: <ClassCode>_GV_<TeacherID>_<Timestamp>.mp4
    if [[ "$FILENAME" =~ ^(.*)_[gG][vV]_([0-9]+)_(.*)\.mp4$ ]]; then
        CLASS_CODE="${BASH_REMATCH[1]}"
        TEACHER_ID="${BASH_REMATCH[2]}"
        TIMESTAMP="${BASH_REMATCH[3]}"
        
        echo "Parsed (Pattern 1): ClassCode=$CLASS_CODE, TeacherID=$TEACHER_ID, Timestamp=$TIMESTAMP"
        rclone copyto "$MP4_FILE" "minio:$MINIO_BUCKET/$TEACHER_ID/$CLASS_CODE/$TIMESTAMP.mp4"
        
        JSON_FILE=$(find "$RECORDING_DIR" -name "*.json" | head -n 1)
        if [ -f "$JSON_FILE" ]; then
            rclone copyto "$JSON_FILE" "minio:$MINIO_BUCKET/$TEACHER_ID/$CLASS_CODE/$TIMESTAMP.json"
        fi
    # Pattern 2: <ClassCode>_<Timestamp>.mp4 (Standard roomName format)
    elif [[ "$FILENAME" =~ ^(.*)_([0-9]{4}-[0-9]{2}-[0-9]{2}.*)\.mp4$ ]]; then
        CLASS_CODE="${BASH_REMATCH[1]}"
        TIMESTAMP="${BASH_REMATCH[2]}"
        
        echo "Parsed (Pattern 2): ClassCode=$CLASS_CODE, Timestamp=$TIMESTAMP"
        rclone copyto "$MP4_FILE" "minio:$MINIO_BUCKET/recordings/$CLASS_CODE/$TIMESTAMP.mp4"
        
        JSON_FILE=$(find "$RECORDING_DIR" -name "*.json" | head -n 1)
        if [ -f "$JSON_FILE" ]; then
            rclone copyto "$JSON_FILE" "minio:$MINIO_BUCKET/recordings/$CLASS_CODE/$TIMESTAMP.json"
        fi
    else
        echo "Copying video to recordings/$FILENAME"
        rclone copyto "$MP4_FILE" "minio:$MINIO_BUCKET/recordings/$FILENAME"
    fi
else
    echo "No MP4 file found in $RECORDING_DIR!"
fi

# Check if rclone was successful
if [ $? -eq 0 ]; then
    echo "Upload successful. Deleting local recording to save space."
    rm -rf "$RECORDING_DIR"
else
    echo "Upload failed! Keeping local file."
fi

exit 0
