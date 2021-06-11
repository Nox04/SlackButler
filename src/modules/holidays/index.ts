class Holidays {
  private holidays: string[];
  private fetchDate: any;
  private readonly requester;
  private fetcher = require('../fetcher');
  private dayjs = require('dayjs');

  constructor() {
    this.holidays = [];
    this.fetchDate = this.dayjs();
    this.requester = new this.fetcher();
  }

  isCacheExpired() {
    return (
      this.fetchDate.format('YYYY-MM-DD') !== this.dayjs().format('YYYY-MM-DD')
    );
  }

  resetCache() {
    this.fetchDate = this.dayjs();
  }

  async isHoliday(): Promise<boolean> {
    if (this.holidays.length === 0 || this.isCacheExpired()) {
      this.resetCache();
      const endpoint = `https://calendarific.com/api/v2/holidays?api_key=${
        process.env.CALENDARIFIC_API_KEY
      }&country=${
        process.env.COUNTRY
      }&year=${this.fetchDate.year()}&type=national`;
      return new Promise(async (resolve, reject) => {
        const response = await this.requester.getData(endpoint);
        this.holidays = response.response.holidays.map(
          holiday => holiday.date.iso,
        );
        resolve(this.holidays.includes(this.fetchDate.format('YYYY-MM-DD')));
      });
    } else {
      return Promise.resolve(
        this.holidays.includes(this.fetchDate.format('YYYY-MM-DD')),
      );
    }
  }
}
module.exports = Holidays;
