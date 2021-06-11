require('dotenv').config();
const dayjs = require('dayjs');
const HolidaysApi = require('./modules/holidays');
const SlackApi = require('./modules/slack');
const holiday = new HolidaysApi();
const slack = new SlackApi();

//TODO: Validate weekends

const CustomMessages = {
  focused: {
    status_text: 'Focused',
    status_emoji: ':gameon:',
  },
  eating: {
    status_text: 'Lunch',
    status_emoji: ':meat_on_bone:',
  },
  holiday: {
    status_text: 'Holiday',
    status_emoji: ':flag-co:',
  },
  sleeping: {
    status_text: 'Recovering',
    status_emoji: ':zzz:',
  },
};
const workingHours = [9, 10, 11, 12, 13, 14, 15, 16];

function determinateStatus(isHoliday: boolean): 'active' | 'away' {
  if (isHoliday) {
    return 'away';
  } else {
    const currentHour = dayjs().hour();
    return workingHours.includes(currentHour) ? 'active' : 'away';
  }
}

function determinateCustomMessage(isHoliday: boolean) {
  if (isHoliday) {
    return CustomMessages.holiday;
  } else {
    const currentHour = dayjs().hour();
    if (currentHour === 12) {
      return CustomMessages.eating;
    }
    if (workingHours.includes(currentHour)) {
      return CustomMessages.focused;
    } else {
      return CustomMessages.sleeping;
    }
  }
}

async function Butler() {
  const currentStatus = await slack.getStatus();
  const currentProfileStatus = await slack.getProfileStatus();
  const isHoliday = await holiday.isHoliday();
  const desirableStatus = determinateStatus(isHoliday);
  const desirableProfileStatus = determinateCustomMessage(isHoliday);

  if (desirableStatus !== currentStatus) {
    const result = await slack.setStatus(
      desirableStatus === 'away' ? 'away' : 'auto',
    );
    if (result) {
      console.log(`New status set to: ${desirableStatus}`);
    } else {
      console.log(`Failed to set the new status: ${desirableStatus}`);
    }
  } else {
    console.log(`Keeping the status: ${desirableStatus}`);
  }

  if (desirableProfileStatus.status_text !== currentProfileStatus) {
    const result = await slack.setProfileStatus(desirableProfileStatus);
    if (result) {
      console.log(
        `New profile status set to: ${desirableProfileStatus.status_text}`,
      );
    } else {
      console.log(
        `Failed to set the new profile status: ${desirableProfileStatus.status_text}`,
      );
    }
  } else {
    console.log(
      `Keeping the profile status: ${desirableProfileStatus.status_text}`,
    );
  }
}

setInterval(Butler, 60000);
