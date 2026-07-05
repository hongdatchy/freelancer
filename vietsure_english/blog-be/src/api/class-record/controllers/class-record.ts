import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';

// Initialize S3 Client for MinIO
const s3Client = new S3Client({
  endpoint: process.env.MINIO_ENDPOINT || 'http://127.0.0.1:9000',
  forcePathStyle: true, // Required for MinIO
  region: 'us-east-1',  // MinIO doesn't care about region but SDK requires it
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY || 'minioadmin',
    secretAccessKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
  },
});

const BUCKET = process.env.MINIO_BUCKET || 'jitsi-recordings';

export default {
  async find(ctx) {
    const { teacherId, classCode, date } = ctx.query;

    if (!teacherId) {
      return ctx.badRequest('teacherId is required');
    }

    try {
      // 1. If only teacherId is provided, list all class folders under jitsi-recordings/<teacherId>/
      if (teacherId && !classCode) {
        const command = new ListObjectsV2Command({
          Bucket: BUCKET,
          Prefix: `${teacherId}/`,
          Delimiter: '/',
        });

        const response = await s3Client.send(command);
        const folders = response.CommonPrefixes || [];
        
        // Extract class codes from prefixes (e.g. "15/MATH101/" -> "MATH101")
        const classes = folders.map(f => {
          const prefix = f.Prefix || '';
          const parts = prefix.split('/');
          return parts[parts.length - 2];
        }).filter(Boolean);

        return ctx.send({ classes });
      }

      // 2. If both teacherId and classCode are provided, list all files under jitsi-recordings/<teacherId>/<classCode>/
      if (teacherId && classCode) {
        const command = new ListObjectsV2Command({
          Bucket: BUCKET,
          Prefix: `${teacherId}/${classCode}/`,
        });

        const response = await s3Client.send(command);
        const contents = response.Contents || [];

        // Filter and map only .mp4 files
        let records = contents
          .filter(item => item.Key && item.Key.endsWith('.mp4'))
          .map(item => {
            const key = item.Key || '';
            const filename = key.substring(key.lastIndexOf('/') + 1);
            // Filename format: YYYY-MM-DD-HH-mm-ss.mp4
            const timestamp = filename.replace('.mp4', '');
            
            // Parse UTC parts
            const year = parseInt(timestamp.substring(0, 4));
            const month = parseInt(timestamp.substring(5, 7)) - 1; // 0-indexed
            const day = parseInt(timestamp.substring(8, 10));
            const hour = parseInt(timestamp.substring(11, 13));
            const minute = parseInt(timestamp.substring(14, 16));
            const second = parseInt(timestamp.substring(17, 19));
            
            // Create UTC Date object
            const utcDate = new Date(Date.UTC(year, month, day, hour, minute, second));
            
            // Convert to Vietnam Time (UTC+7)
            let localDateStr = '';
            let localTimeStr = '';
            try {
              const formatter = new Intl.DateTimeFormat('en-US', {
                timeZone: 'Asia/Ho_Chi_Minh',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
              });
              const parts = formatter.formatToParts(utcDate);
              const y = parts.find(p => p.type === 'year')?.value;
              const m = parts.find(p => p.type === 'month')?.value;
              const d = parts.find(p => p.type === 'day')?.value;
              const hr = parts.find(p => p.type === 'hour')?.value;
              const min = parts.find(p => p.type === 'minute')?.value;
              const sec = parts.find(p => p.type === 'second')?.value;
              
              localDateStr = `${y}-${m}-${d}`;
              localTimeStr = `${hr}:${min}:${sec}`;
            } catch (e) {
              // Fallback if formatting fails
              localDateStr = timestamp.substring(0, 10);
              localTimeStr = timestamp.substring(11).replace(/-/g, ':');
            }
            
            // Build the download/stream URL
            const url = `${process.env.MINIO_ENDPOINT || 'http://127.0.0.1:9000'}/${BUCKET}/${key}`;

            return {
              filename,
              timestamp,
              date: localDateStr,
              time: localTimeStr,
              size: item.Size,
              url,
            };
          });

        // Sort by timestamp descending (newest first)
        records.sort((a, b) => b.timestamp.localeCompare(a.timestamp));

        // Filter by date if specified (YYYY-MM-DD)
        if (date) {
          records = records.filter(r => r.date === date);
        }

        return ctx.send({ records });
      }

    } catch (error) {
      strapi.log.error('Error fetching class records from MinIO:', error);
      return ctx.internalServerError('Failed to fetch class records');
    }
  },
};
