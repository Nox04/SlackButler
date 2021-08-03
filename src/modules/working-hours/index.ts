class WorkingHours {
  private readonly isHoliday: boolean;
  private readonly currentPresence: string;
  private readonly currentStatus: string;
  private readonly workingHours = [9, 10, 11, 12, 13, 14, 15, 16];
  private readonly statuses = {
    focused: {
      status_text: 'Focused',
      status_emoji: ':gon:',
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
    weekend: {
      status_text: 'Weekend',
      status_emoji: ':umbrella_on_ground:',
    },
  };
  private dayjs = require('dayjs');
  private SlackApi = require('../slack');
  private slack;

  constructor(
    isHoliday: boolean,
    currentPresence: string,
    currentStatus: string,
  ) {
    this.isHoliday = isHoliday;
    this.currentPresence = currentPresence;
    this.currentStatus = currentStatus;
    this.slack = new this.SlackApi();
  }

  private determinatePresence(): 'active' | 'away' {
    if (this.isHoliday) {
      return 'away';
    } else if ([0, 6].includes(this.dayjs().day())) {
      return 'away';
    } else {
      const currentHour = this.dayjs().hour();
      return this.workingHours.includes(currentHour) ? 'active' : 'away';
    }
  }

  private determinateStatus() {
    if (this.isHoliday) {
      return this.statuses.holiday;
    } else if ([0, 6].includes(this.dayjs().day())) {
      return this.statuses.weekend;
    } else {
      const currentHour = this.dayjs().hour();
      if (currentHour === 12) {
        return this.statuses.eating;
      }
      if (this.workingHours.includes(currentHour)) {
        return this.statuses.focused;
      } else {
        return this.statuses.sleeping;
      }
    }
  }

  async setSlackPresence() {
    const desirablePresence = this.determinatePresence();
    if (desirablePresence !== this.currentPresence) {
      const result = await this.slack.setPresence(
        desirablePresence === 'away' ? 'away' : 'auto',
      );
      if (result) {
        console.log(`New status set to: ${desirablePresence}`);
      } else {
        console.log(`Failed to set the new status: ${desirablePresence}`);
      }
    } else {
      console.log(`Keeping the status: ${desirablePresence}`);
    }
  }

  async setSlackStatus() {
    const desirableStatus = this.determinateStatus();
    if (desirableStatus.status_text !== this.currentStatus) {
      const result = await this.slack.setStatus(desirableStatus);
      if (result) {
        console.log(
          `New profile status set to: ${desirableStatus.status_text}`,
        );
      } else {
        console.log(
          `Failed to set the new profile status: ${desirableStatus.status_text}`,
        );
      }
    } else {
      console.log(`Keeping the profile status: ${desirableStatus.status_text}`);
    }
  }
}
module.exports = WorkingHours;
