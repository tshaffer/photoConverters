import { Tags, ExifDateTime } from "exiftool-vendored";
import { DateTime, DateTimeJSOptions } from 'luxon';

export async function convertCreateDateToISO(tags: Tags): Promise<string | null> {
  try {
    const createDate = tags.CreateDate; // ExifDateTime | string | undefined
    if (!createDate) {
      throw new Error('CreateDate not found in EXIF tags');
    }

    let isoDateString: string;

    if (createDate instanceof ExifDateTime) {
      
      const options: DateTimeJSOptions = { zone: 'utc' };

      // If CreateDate is an ExifDateTime object, use its properties directly and set to UTC
      const dateTime = DateTime.fromObject({
        year: createDate.year,
        month: createDate.month,
        day: createDate.day,
        hour: createDate.hour,
        minute: createDate.minute,
        second: createDate.second,
        millisecond: createDate.millisecond,
        zone: 'utc',
        // ...options,
      });
      isoDateString = dateTime.toISO();
    } else {
      // If CreateDate is a string, parse and format it using Luxon and set to UTC
      // Assuming the string format is "yyyy:MM:dd HH:mm:ss"
      const parsedDate = DateTime.fromFormat(createDate, 'yyyy:MM:dd HH:mm:ss', { zone: 'utc' });
      isoDateString = parsedDate.toISO();
    }

    return isoDateString;
  } catch (err) {
    console.error('Error converting CreateDate to ISO format:', err);
    return null;
  }
}

