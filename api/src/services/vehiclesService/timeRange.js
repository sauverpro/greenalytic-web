/**
 * Service for handling time range calculations
 */
export class TimeRangeService {
  /**
   * Get a time range based on period type and value
   * @param {string} periodType - Type of period ('day', 'week', 'month', 'year', 'custom')
   * @param {string} periodValue - Value for the period (date, week number, month, year)
   * @returns {Object} - Start and end dates for the period
   */
  static getTimeRange(periodType, periodValue) {
    const now = new Date();
    let startDate;
    let endDate;

    if (!periodType || periodType === "all") {
      // Default to all time if no period specified
      startDate = new Date(2000, 0, 1); // Beginning of 2000
      endDate = new Date(now.getFullYear() + 10, 11, 31); // End of future year
      return { startDate, endDate };
    }

    switch (periodType) {
      case "day":
        if (periodValue) {
          // Specific day (YYYY-MM-DD)
          startDate = new Date(periodValue);
          endDate = new Date(periodValue);
        } else {
          // Today
          startDate = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
          );
          endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        }
        endDate.setHours(23, 59, 59, 999);
        break;

      case "week":
        if (periodValue) {
          // Specific week (YYYY-WW)
          const [year, week] = periodValue.split("-W");
          startDate = TimeRangeService.getDateOfWeek(
            parseInt(week),
            parseInt(year)
          );
        } else {
          // Current week
          const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
          const diff = now.getDate() - currentDay + (currentDay === 0 ? -6 : 1); // Adjust to get Monday
          startDate = new Date(now.setDate(diff));
          startDate.setHours(0, 0, 0, 0);
        }
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        endDate.setHours(23, 59, 59, 999);
        break;

      case "month":
        if (periodValue) {
          // Specific month (YYYY-MM)
          const [year, month] = periodValue.split("-");
          startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
          endDate = new Date(parseInt(year), parseInt(month), 0);
        } else {
          // Current month
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        }
        endDate.setHours(23, 59, 59, 999);
        break;

      case "year":
        if (periodValue) {
          // Specific year (YYYY)
          startDate = new Date(parseInt(periodValue), 0, 1);
          endDate = new Date(parseInt(periodValue), 11, 31);
        } else {
          // Current year
          startDate = new Date(now.getFullYear(), 0, 1);
          endDate = new Date(now.getFullYear(), 11, 31);
        }
        endDate.setHours(23, 59, 59, 999);
        break;

      case "custom":
      default:
        // Custom range or fallback to current month if nothing specified
        if (periodValue) {
          const [start, end] = periodValue.split(",");
          startDate = new Date(start);
          endDate = new Date(end);
          endDate.setHours(23, 59, 59, 999);
        } else {
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          endDate = new Date(
            now.getFullYear(),
            now.getMonth() + 1,
            0,
            23,
            59,
            59,
            999
          );
        }
    }

    return { startDate, endDate };
  }

  /**
   * Get the date of a specific week in a year
   * @param {number} week - Week number (1-53)
   * @param {number} year - Year
   * @returns {Date} - Date object representing the first day of the week
   */
  static getDateOfWeek(week, year) {
    const date = new Date(year, 0, 1);
    const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const firstMonday = 1 + (dayOfWeek <= 1 ? 1 - dayOfWeek : 8 - dayOfWeek);

    // Set to the first day of the requested week
    date.setDate(firstMonday + (week - 1) * 7);
    return date;
  }

  /**
   * Format a date range for display
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {string} - Formatted date range
   */
  static formatDateRange(startDate, endDate) {
    const formatDate = (date) => {
      return date.toISOString().split("T")[0];
    };

    return `${formatDate(startDate)} to ${formatDate(endDate)}`;
  }
}
