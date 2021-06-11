class Slack {
  private fetcher = require('../fetcher');
  private readonly requester;

  constructor() {
    this.requester = new this.fetcher(process.env.SLACK_API_KEY);
  }

  async getStatus(): Promise<'active' | 'away'> {
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

  async getProfileStatus(): Promise<string> {
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

  async setStatus(status: 'auto' | 'away'): Promise<boolean> {
    return new Promise(async resolve => {
      const response = await this.requester.postData(
        `https://slack.com/api/users.setPresence`,
        {
          presence: status,
        },
      );
      resolve(response.ok);
    });
  }

  async setProfileStatus(profileStatus): Promise<boolean> {
    return new Promise(async resolve => {
      const response = await this.requester.postData(
        `https://slack.com/api/users.profile.set`,
        {
          profile: profileStatus,
        },
      );
      resolve(response.ok);
    });
  }
}
module.exports = Slack;
