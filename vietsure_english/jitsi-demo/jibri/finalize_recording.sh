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

# Upload all mp4 files in the recording dir
rclone copy "$RECORDING_DIR" "minio:$MINIO_BUCKET/$(basename $RECORDING_DIR)"

# Check if rclone was successful
if [ $? -eq 0 ]; then
    echo "Upload successful. Deleting local recording to save space."
    rm -rf "$RECORDING_DIR"
else
    echo "Upload failed! Keeping local file."
fi

exit 0
