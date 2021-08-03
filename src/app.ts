require('dotenv').config();
const HolidaysApi = require('./modules/holidays');
const SlackApi = require('./modules/slack');
const WorkingHoursApi = require('./modules/working-hours');
const holiday = new HolidaysApi();
const slack = new SlackApi();

//TODO: Custom events list
//TODO: Handle lost connection

async function Butler() {
  const currentPresence = await slack.getPresence();
  const currentStatus = await slack.getStatus();
  const isHoliday = await holiday.isHoliday();
  const workingHours = new WorkingHoursApi(
    isHoliday,
    currentPresence,
    currentStatus,
  );
  await workingHours.setSlackPresence();
  await workingHours.setSlackStatus();
}

Butler();
setInterval(Butler, 300000);
