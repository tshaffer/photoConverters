import { Tags, ExifDateTime } from "exiftool-vendored";
import { DateTime } from 'luxon';

export async function convertCreateDateToISO(tags: Tags): Promise<string | null> {
  const createDate = tags.CreateDate; // ExifDateTime | string | undefined
  if (!createDate) {
    throw new Error('CreateDate not found in EXIF tags');
  }
  let isoDateString: string;
  if (createDate instanceof ExifDateTime) {
    isoDateString = convertExifDateTimeToUTC(createDate);
  }
  else {
    const parsedDate: DateTime = DateTime.fromFormat(createDate, 'yyyy:MM:dd HH:mm:ss', { zone: 'utc' });
    isoDateString = parsedDate.toISO();
  }

  console.log('isoDateString: ', isoDateString);
  return isoDateString;
}

function convertExifDateTimeToUTC(exifDateTime: ExifDateTime): string {
  // Create a Luxon DateTime object from the ExifDateTime components
  const dateTime = DateTime.fromObject({
    year: exifDateTime.year,
    month: exifDateTime.month,
    day: exifDateTime.day,
    hour: exifDateTime.hour,
    minute: exifDateTime.minute,
    second: exifDateTime.second,
    millisecond: exifDateTime.millisecond,
    zone: exifDateTime.tzoffsetMinutes !== undefined
      ? `UTC${(exifDateTime.tzoffsetMinutes / 60) >= 0 ? '+' : ''}${(exifDateTime.tzoffsetMinutes / 60)}`
      : 'UTC' // Default to UTC if no offset is provided
  });

  // Convert to UTC and return as ISO string with 'Z' suffix
  return dateTime.toUTC().toISO();
}
