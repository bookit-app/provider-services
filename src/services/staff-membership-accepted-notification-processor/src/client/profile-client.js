'use strict';

class ProfileClient {
  constructor(client, tokenClient, host) {
    this.host = host;
    this.tokenClient = tokenClient;
    this.client = client;
  }

  async queryProfile(profileId) {
    const token = await this.tokenClient.getToken(this.host);

    return this.client.get({
      url: `${this.host}/admin/profile/${profileId}`,
      auth: {
        bearer: token
      },
      json: true
    });
  }
}

module.exports = ProfileClient;
module.exports.profileClientInstance = new ProfileClient(
  require('./http-client'),
  require('./token-client').tokenClientInstance,
  process.env.PROFILE_SERVICE_HOST
);
