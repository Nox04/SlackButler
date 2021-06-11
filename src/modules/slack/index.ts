class Slack {
  private fetcher = require('../fetcher');
  private readonly requester;

  constructor() {
    this.requester = new this.fetcher(process.env.SLACK_API_KEY);
  }

  async getPresence(): Promise<'active' | 'away'> {
    return new Promise(async (resolve, reject) => {
      const response = await this.requester.getData(
        `https://slack.com/api/users.getPresence?user=${process.env.SLACK_USER_ID}`,
      );
      if (response.ok) {
        resolve(response.presence);
      } else {
        reject(response.error);
      }
    });
  }

  async getStatus(): Promise<string> {
    return new Promise(async (resolve, reject) => {
      const response = await this.requester.getData(
        `https://slack.com/api/users.profile.get?user=${process.env.SLACK_USER_ID}`,
      );
      if (response.ok) {
        resolve(response.profile.status_text);
      } else {
        reject(response.error);
      }
    });
  }

  async setPresence(presence: 'auto' | 'away'): Promise<boolean> {
    return new Promise(async resolve => {
      const response = await this.requester.postData(
        `https://slack.com/api/users.setPresence`,
        {
          presence: presence,
        },
      );
      resolve(response.ok);
    });
  }

  async setStatus(status): Promise<boolean> {
    return new Promise(async resolve => {
      const response = await this.requester.postData(
        `https://slack.com/api/users.profile.set`,
        {
          profile: status,
        },
      );
      resolve(response.ok);
    });
  }
}
module.exports = Slack;
