/**
	Utilities for date manipulating.
	Inspired from CASA Lib / AS 2.0 (v.10/06/08) - Aaron Clinger, David Nelson
	
	@author Adrien Dufond - manmaru, Inc.
	@src https://github.com/adrien-dufond/manmaru
	@version 0.1
	@since 28/11/2016
	
	Distributed under the terms of the MIT license.
	http://www.opensource.org/licenses/mit-license.html
*/

DateUtil = (function() {
	
	function DateUtil() {}


    //numberutil
    DateUtil.addLeadingZero = function(value) {
        return (value < 10) ? '0' + value : value.toString();
    }
    DateUtil.getOrdinalSuffix = function(num) {
        if (num >= 10 && num <= 20)
            return 'th';
            
        switch (num % 10) {
            case 0 :
            case 4 :
            case 5 :
            case 6 :
            case 7 :
            case 8 :
            case 9 :
                return 'th';
            case 3 :
                return 'rd';
            case 2 :
                return 'nd';
            case 1 :
                return 'st';
        }
    }
    DateUtil.format = function(numberToFormat, minLength, thouDelim, fillChar) {
        var num = numberToFormat.toString(),
            len = num.length;
        
        if (thouDelim != undefined) {
            var numSplit = num.split(''),
                counter = 3,
                i       = numSplit.length;
            
            while (--i > 0) {
                counter--;
                if (counter == 0) {
                    counter = 3;
                    numSplit.splice(i, 0, thouDelim);
                }
            }
            
            num = numSplit.join('');
        }
        
        if (minLength != undefined) {
            if (len < minLength) {
                minLength -= len;
                
                var addChar = (fillChar == undefined) ? '0' : fillChar;
                
                while (minLength--)
                    num = addChar + num;
            }
        }
        
        return num;
    }
    

 	/*
        @param dateToFormat: The Date object you wish to format.
        @param formatString: The format of the outputted date string. See the format characters options above.
        @usageNote You can prevent a recognized character in the format string from being expanded by escaping it with a preceding <code>^</code>.
        @example
        <code>
            trace(DateUtil.formatDate(new Date(), "l ^t^h^e dS ^of F Y h:i:s A"));
        </code>
    */
    DateUtil.formatDate = function(dateToFormat, formatString) {
        var returnString = '',
            char,
            i = -1,
            t;
        
        while (++i < formatString.length) {
            char = formatString.substr(i, 1);
            
            if (char == '^')
                returnString += formatString.substr(++i, 1);
            else {
                switch (char) {
                    // Day of the month, 2 digits with leading zeros
                    case 'd' :
                        returnString += DateUtil.addLeadingZero(dateToFormat.getDate());
                        break;
                    // A textual representation of a day, three letters
                    case 'D' :
                        returnString += DateUtil.getDayAbbrAsString(dateToFormat.getDay());
                        break;
                    // Day of the month without leading zeros
                    case 'j' :
                        returnString += dateToFormat.getDate().toString();
                        break;
                    // A full textual representation of the day of the week
                    case 'l' :
                        returnString += DateUtil.getDayAsString(dateToFormat.getDay());
                        break;
                    // ISO-8601 numeric representation of the day of the week
                    case 'N' :
                        t = dateToFormat.getDay();
                        
                        if (t == 0)
                            t = 7;
                        
                        returnString += t.toString();
                        break;
                    // English ordinal suffix for the day of the month, 2 characters
                    case 'S' :
                        returnString += DateUtil.getOrdinalSuffix(dateToFormat.getDate());
                        break;
                    // Numeric representation of the day of the week
                    case 'w' :
                        returnString += dateToFormat.getDay().toString();
                        break;
                    // The day of the year (starting from 0)
                    case 'z' :
                        returnString += DateUtil.addLeadingZero(DateUtil.getDayOfTheYear(dateToFormat)).toString();
                        break;
                    // ISO-8601 week number of year, weeks starting on Monday 
                    case 'W' :
                        returnString += DateUtil.addLeadingZero(DateUtil.getWeekOfTheYear(dateToFormat)).toString();
                        break;
                    // A full textual representation of a month, such as January or March
                    case 'F' :
                        returnString += DateUtil.getMonthAsString(dateToFormat.getMonth());
                        break;
                    // Numeric representation of a month, with leading zeros
                    case 'm' :
                        returnString += DateUtil.addLeadingZero(dateToFormat.getMonth() + 1);
                        break;
                    // A short textual representation of a month, three letters
                    case 'M' :
                        returnString += DateUtil.getMonthAbbrAsString(dateToFormat.getMonth());
                        break;
                    // Numeric representation of a month, without leading zeros
                    case 'n' :
                        returnString += (dateToFormat.getMonth() + 1).toString();
                        break;
                    // Number of days in the given month
                    case 't' :
                        returnString += DateUtil.getDaysInMonth(dateToFormat.getMonth(), dateToFormat.getFullYear()).toString();
                        break;
                    // Whether it's a leap year
                    case 'L' :
                        returnString += (DateUtil.isLeapYear(dateToFormat.getFullYear())) ? '1' : '0';
                        break;
                    // A full numeric representation of a year, 4 digits
                    case 'o' :
                    case 'Y' :
                        returnString += dateToFormat.getFullYear().toString();
                        break;
                    // A two digit representation of a year
                    case 'y' :
                        returnString += dateToFormat.getFullYear().toString().substr(-2);
                        break;
                    // Lowercase Ante meridiem and Post meridiem
                    case 'a' :
                        returnString += DateUtil.getMeridiem(dateToFormat.getHours()).toLowerCase();
                        break;
                    // Uppercase Ante meridiem and Post meridiem
                    case 'A' :
                        returnString += DateUtil.getMeridiem(dateToFormat.getHours());
                        break;
                    // Swatch Internet time
                    case 'B' :
                        returnString += DateUtil.format(DateUtil.getInternetTime(dateToFormat), 3, null, '0');
                        break;
                    // 12-hour format of an hour without leading zeros
                    case 'g' :
                        t = dateToFormat.getHours();
                        
                        if (t == 0)
                            t = 12;
                        else if (t > 12)
                            t -= 12;
                        
                        returnString += t.toString();
                        break;
                    // 24-hour format of an hour without leading zeros
                    case 'G' :
                        returnString += dateToFormat.getHours().toString();
                        break;
                    // 12-hour format of an hour with leading zeros
                    case 'h' :
                        t = dateToFormat.getHours() + 1;
                        
                        if (t == 0)
                            t = 12;
                        else if (t > 12)
                            t -= 12;
                        
                        returnString += DateUtil.addLeadingZero(t);
                        break;
                    // 24-hour format of an hour with leading zeros
                    case 'H' :
                        returnString += DateUtil.addLeadingZero(dateToFormat.getHours());
                        break;
                    // Minutes with leading zeros
                    case 'i' :
                        returnString += DateUtil.addLeadingZero(dateToFormat.getMinutes());
                        break;
                    // Seconds, with leading zeros
                    case 's' :
                        returnString += DateUtil.addLeadingZero(dateToFormat.getSeconds());
                        break;
                    // Whether or not the date is in daylights savings time
                    case 'I' :
                        returnString += (DateUtil.isDaylightSavings(dateToFormat)) ? '1' : '0';
                        break;
                    // Difference to Greenwich time (GMT/UTC) in hours
                    case 'O' :
                        returnString += DateUtil.getFormattedDifferenceFromUTC(dateToFormat);
                        break;
                    case 'P' :
                        returnString += DateUtil.getFormattedDifferenceFromUTC(dateToFormat, ':');
                        break;
                    // Timezone identifier
                    case 'e' :
                    case 'T' :
                        returnString += DateUtil.getTimezone(dateToFormat);
                        break;
                    // Timezone offset (GMT/UTC) in seconds.
                    case 'Z' :
                        returnString += Math.round(DateUtil.getDifferenceFromUTCInSeconds(dateToFormat)).toString();
                        break;
                    // ISO 8601 date
                    case 'c' :
                        returnString += dateToFormat.getFullYear() + "-" + DateUtil.addLeadingZero(dateToFormat.getMonth() + 1) + "-" + DateUtil.addLeadingZero(dateToFormat.getDate()) + "T" + DateUtil.addLeadingZero(dateToFormat.getHours()) + ":" + DateUtil.addLeadingZero(dateToFormat.getMinutes()) + ":" + DateUtil.addLeadingZero(dateToFormat.getSeconds()) + DateUtil.getFormattedDifferenceFromUTC(dateToFormat, ':');
                        break;
                    // RFC 2822 formatted date
                    case 'r' :
                        returnString += DateUtil.getDayAbbrAsString(dateToFormat.getDay()) + ', ' + dateToFormat.getDate() + ' ' + DateUtil.getMonthAbbrAsString(dateToFormat.getMonth()) + ' ' + dateToFormat.getFullYear() + ' ' + DateUtil.addLeadingZero(dateToFormat.getHours()) + ':' + DateUtil.addLeadingZero(dateToFormat.getMinutes()) + ':' + DateUtil.addLeadingZero(dateToFormat.getSeconds()) + ' ' + DateUtil.getFormattedDifferenceFromUTC(dateToFormat);
                        break;
                    // Seconds since the Unix Epoch (January 1 1970 00:00:00 GMT)
                    case 'U' :
                        t = Math.round(dateToFormat.getTime() / 1000);
                        returnString += t.toString();
                        break;
                    default :
                        returnString += formatString.substr(i, 1);
                        break;
                }
            }
        }
        
        
        return returnString;
    }
    
        /**
            Converts W3C ISO 8601 date strings into a Date object.
            
            @param iso8601: A valid ISO 8601 formatted string.
            @return Returns a Date object of the specified date and time of the ISO 8601 string in universal time.
            @see <a href="http://www.w3.org/TR/NOTE-datetime">W3C ISO 8601 specification</a>
            @example
                <code>
                    trace(DateUtil.iso8601ToDate("1994-11-05T08:15:30-05:00").toString());
                </code>
        */
        DateUtil.iso8601ToDate = function(iso8601) {
        var parts        = iso8601.toUpperCase().split('T'),
            date         = parts[0].split('-'),
            time         = parts[1].split(':'),
            year        = ObjectUtil.isEmpty(date[0]) ? undefined : Number(date[0]),
            month       = ObjectUtil.isEmpty(date[1]) ? undefined : Number(date[1] - 1),
            day         = ObjectUtil.isEmpty(date[2]) ? undefined : Number(date[2]),
            hour        = ObjectUtil.isEmpty(time[0]) ? undefined : Number(time[0]),
            minute      = ObjectUtil.isEmpty(time[1]) ? undefined : Number(time[1]),
            second      = undefined,
            millisecond = undefined;
        
        if (time[2] != undefined) {
            var index = time[2].length,
                temp;
            if (time[2].indexOf('+') != -1)
                index = time[2].indexOf('+');
            else if (time[2].indexOf('-') != -1)
                index = time[2].indexOf('-');
            else if (time[2].indexOf('Z') != -1)
                index = time[2].indexOf('Z');
            
            if (index != undefined) {
                temp        = Number(time[2].slice(0, index));
                second      = Math.floor(temp);
                millisecond = 1000 * ((temp % 1) / 1);
            }
            
            if (index != time[2].length) {
                var offset     = time[2].slice(index),
                    userOffset = DateUtil.getDifferenceFromUTCInHours(new Date(year, month, day));
                
                switch (offset.charAt(0)) {
                    case '+' :
                    case '-' :
                        hour -= userOffset + Number(offset.slice(0));
                        break;
                    case 'Z' :
                        hour -= userOffset;
                        break;
                }
            }
        }
        
        return new Date(year, month, day, hour, minute, second, millisecond);
    }
    
    /**
        Converts the month number into the full month name.
        
        @param month: The month number (0 for January, 1 for February, and so on).
        @return Returns a full textual representation of a month, such as January or March.
        @example
            <code>
                var myDate:Date = new Date(2000, 0, 1);
                
                trace(DateUtil.getMonthAsString(myDate.getMonth())); // Traces January
            </code>
    */
    DateUtil.getMonthAsString = function(month) {
        var monthNamesFull = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');
        return monthNamesFull[month];
    }
    
    /**
        Converts the month number into the month abbreviation.
        
        @param month: The month number (0 for January, 1 for February, and so on).
        @return Returns a short textual representation of a month, three letters.
        @example
            <code>
                var myDate:Date = new Date(2000, 0, 1);
                
                trace(DateUtil.getMonthAbbrAsString(myDate.getMonth())); // Traces Jan
            </code>
    */
    DateUtil.getMonthAbbrAsString = function(month) {
        return DateUtil.getMonthAsString(month).substr(0, 3);
    }
    
    /**
        Converts the day of the week number into the full day name.
        
        @param day: An integer representing the day of the week (0 for Sunday, 1 for Monday, and so on).
        @return Returns a full textual representation of the day of the week.
        @example
            <code>
                var myDate:Date = new Date(2000, 0, 1);
                
                trace(DateUtil.getDayAsString(myDate.getDay())); // Traces Saturday
            </code>
    */
    DateUtil.getDayAsString = function(day) {
        var dayNamesFull = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
        return dayNamesFull[day];
    }
    
    /**
        Converts the day of the week number into the day abbreviation.
        
        @param day: An integer representing the day of the week (0 for Sunday, 1 for Monday, and so on).
        @return Returns a textual representation of a day, three letters.
        @example
            <code>
                var myDate:Date = new Date(2000, 0, 1);
                
                trace(DateUtil.getDayAbbrAsString(myDate.getDay())); // Traces Sat
            </code>
    */
    DateUtil.getDayAbbrAsString = function(day) {
        return DateUtil.getDayAsString(day).substr(0, 3);
    }
    
    /**
        Finds the number of days in the given month.
        
        @param year: The full year.
        @param month: The month number (0 for January, 1 for February, and so on).
        @return The number of days in the month; 28 through 31.
        @example
            <code>
                var myDate:Date = new Date(2000, 0, 1);
                
                trace(DateUtil.getDaysInMonth(myDate.getFullYear(), myDate.getMonth())); // Traces 31
            </code>
    */
    DateUtil.getDaysInMonth = function(year, month) {
        return (new Date(year, ++month, 0)).getDate();
    }
    
    /**
        Determines if time is Ante meridiem or Post meridiem.
        
        @param hours: The hour to find the meridiem of (an integer from 0 to 23).
        @return Returns either <code>"AM"</code> or <code>"PM"</code>
        @example
            <code>
                trace(DateUtil.getMeridiem(17)); // Traces PM
            </code>
    */
    DateUtil.getMeridiem = function(hours) {
        return (hours < 12) ? 'AM' : 'PM';
    }
    
    /**
        Determines the difference between two dates.
        
        @param startDate: The starting date.
        @param endDate: The ending date.
        @return Returns the difference in milliseconds between the two dates.
        @example
            <code>
                trace(DateUtil.millisecondsToDays(DateUtil.getTimeBetween(new Date(2007, 0, 1), new Date(2007, 0, 11)))); // Traces 10
            </code>
    */
    DateUtil.getTimeBetween = function(startDate, endDate) {
        return endDate.getTime() - startDate.getTime();
    }
    
    /**
        Determines the time remaining until a certain date.
        
        @param startDate: The starting date.
        @param endDate: The ending date.
        @return Returns an Object with the properties <code>days</code>, <code>hours</code>, <code>minutes</code>, <code>seconds</code> and <code>milliseconds</code> defined as numbers.
        @example
            <code>
                var countdown:Object = DateUtil.getCountdownUntil(new Date(2006, 11, 31, 21, 36), new Date(2007, 0, 1));
                trace("There are " + countdown.hours + " hours and " + countdown.minutes + " minutes until the new year!");
            </code>
    */
    DateUtil.getCountdownUntil = function(startDate, endDate) {
        var daysUntil  = DateUtil.millisecondsToDays(DateUtil.getTimeBetween(startDate, endDate));
        var hoursUntil = DateUtil.daysToHours(daysUntil % 1);
        var minsUntil = DateUtil.hoursToMinutes(hoursUntil % 1);
        var secsUntil  = DateUtil.minutesToSeconds(minsUntil % 1);
        var milliUntil = DateUtil.secondsToMilliseconds(secsUntil % 1);
        
        return {
                    days:         Math.floor(daysUntil),
                    hours:        Math.floor(hoursUntil),
                    minutes:      Math.floor(minsUntil),
                    seconds:      Math.floor(secsUntil), 
                    milliseconds: Math.round(milliUntil)};
    }

    DateUtil.secondsToHours = function(seconds) { return DateUtil.minutesToHours(DateUtil.secondsToMinutes(seconds)); }
    DateUtil.millisecondsToSeconds = function(milliseconds) { return milliseconds / 1000; }
    DateUtil.secondsToMinutes = function(seconds) { return seconds / 60; }
    DateUtil.millisecondsToMinutes = function(milliseconds) { return DateUtil.secondsToMinutes(DateUtil.millisecondsToSeconds(milliseconds)); }
    DateUtil.minutesToHours = function(minutes) { return minutes / 60; }
    DateUtil.millisecondsToHours = function(milliseconds) { return DateUtil.minutesToHours(DateUtil.millisecondsToMinutes(milliseconds)); }
    DateUtil.hoursToDays = function(hours) { return hours / 24; }     
    DateUtil.millisecondsToDays = function(milliseconds) { return DateUtil.hoursToDays(DateUtil.millisecondsToHours(milliseconds)); }
    DateUtil.daysToHours = function(days) { return days * 24; }
    DateUtil.hoursToMinutes = function(hours) { return hours * 60; }
    DateUtil.minutesToSeconds = function(minutes) { return minutes * 60; }
    DateUtil.secondsToMilliseconds = function(seconds) { return seconds * 1000; }

    /**
        Determines the difference to coordinated universal time (UTC) in seconds.
        
        @param d: Date object to find the time zone offset of.
        @return Returns the difference in seconds from UTC.
    */
    DateUtil.getDifferenceFromUTCInSeconds = function(d) {
        return DateUtil.minutesToSeconds(d.getTimezoneOffset());
    }
    
    /**
        Determines the difference to coordinated universal time (UTC) in hours.
        
        @param d: Date object to find the time zone offset of.
        @return Returns the difference in hours from UTC.
    */
    DateUtil.getDifferenceFromUTCInHours = function(d) {
        return DateUtil.minutesToHours(d.getTimezoneOffset());
    }
    
    /**
        Formats the difference to coordinated undefined time (UTC).
        
        @param d: Date object to find the time zone offset of.
        @param separator: <strong>[optional]</strong> The character(s) that separates the hours from minutes; defaults to no separator/<code>""</code>.
        @return Returns the formatted time difference from UTC.
    */
    DateUtil.getFormattedDifferenceFromUTC = function(d, separator) {
        var pre    = (-d.getTimezoneOffset() < 0) ? '-' : '+',
        spacer = (separator == undefined) ? '' : separator;
        
        return pre + DateUtil.addLeadingZero(Math.floor(DateUtil.getDifferenceFromUTCInHours(d))) + spacer + DateUtil.addLeadingZero(d.getTimezoneOffset() % 60);
    }
    
    /**
        Determines the time zone of the user from a Date object.
        
        @param d: Date object to find the time zone of.
        @return Returns the time zone abbreviation.
        @example
            <code>
                trace(DateUtil.getTimezone(new Date()));
            </code>
    */
    DateUtil.getTimezone = function(d) {
        var timeZones = new Array('IDLW', 'NT', 'HST', 'AKST', 'PST', 'MST', 'CST', 'EST', 'AST', 'ADT', 'AT', 'WAT', 'GMT', 'CET', 'EET', 'MSK', 'ZP4', 'ZP5', 'ZP6', 'WAST', 'WST', 'JST', 'AEST', 'AEDT', 'NZST');
            hour     = Math.round(12 + -(d.getTimezoneOffset() / 60));
        
        if (DateUtil.isDaylightSavings(d))
            hour--;
        
        return timeZones[hour];
    }
    
    /**
        Determines if year is a leap year or a common year.
        
        @param year: The full year.
        @return Returns <code>true</code> if year is a leap year; otherwise <code>false</code>.
        @example
            <code>
                var myDate:Date = new Date(2000, 0, 1);
                
                trace(DateUtil.isLeapYear(myDate.getFullYear())); // Traces true
            </code>
    */
    DateUtil.isLeapYear = function(year) {
        return DateUtil.getDaysInMonth(year, 1) == 29;
    }
    
    /**
        Determines whether or not the date is in daylight saving time.
        
        @param d: Date to find if it's during daylight savings time.
        @return Returns <code>true</code> if daylight savings time; otherwise <code>false</code>.
    */
    DateUtil.isDaylightSavings = function(d) {
        var months = 12,
            offset = d.getTimezoneOffset(),
            offsetCheck;
        
        while (months--) {
            offsetCheck = (new Date(d.getFullYear(), months, 1)).getTimezoneOffset();
            
            if (offsetCheck != offset)
                return (offsetCheck > offset);
        }
        
        return false;
    }
    
    /**
        Converts current time into Swatch internet time or beats.
        
        @param d: Date object to convert.
        @return Returns time in beats (0 to 999).
    */
    DateUtil.getInternetTime = function(d) {
        var beats = Math.floor((d.getUTCHours()  + 1 + DateUtil.minutesToHours(d.getUTCMinutes()) + DateUtil.secondsToHours(d.getUTCSeconds())) / 0.024);
        return (beats > 1000) ? beats - 1000 : beats;
    }
    
    /**
        Gets the current day out of the total days in the year (starting from 0).
        
        @param d: Date object to find the current day of the year from.
        @return Returns the current day of the year (0-364 or 0-365 on a leap year).
    */
    DateUtil.getDayOfTheYear = function(d) {
        var firstDay = new Date(d.getFullYear(), 0, 1);
        return Math.floor((d.getTime() - firstDay.getTime()) / 86400000);
    }
    
    /**
        Determines the week number of year, weeks start on Mondays.
        
        @param d: Date object to find the current week number of.
        @return Returns the the week of the year the date falls in.
    */
    DateUtil.getWeekOfTheYear = function(d) {
        var firstDay     = new Date(d.getFullYear(), 0, 1),
            dayOffset  = 9 - firstDay.getDay(),
            firstMonday  = new Date(d.getFullYear(), 0, (dayOffset > 7) ? dayOffset - 7 : dayOffset),
            currentDay   = new Date(d.getFullYear(), d.getMonth(), d.getDate()),
            weekNumber = Math.floor(ConversionUtil.millisecondsToDays(currentDay.getTime() - firstMonday.getTime()) / 7) + 1; 
        
        return (weekNumber == 0) ? DateUtil.getWeekOfTheYear(new Date(d.getFullYear() - 1, 11, 31)) : weekNumber;
    }

    
  


		
    return DateUtil;
    
})();
