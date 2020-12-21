"use strict";

const axios = require("axios");
const fs = require("fs");

const hitWakatime = async (detail, users) => {
  try {
    const { startDate, endDate } = detail;
    users.forEach(async (user) => {
      try {
        const { username, apiKey } = user;
        const { data } = await axios({
          method: "get",
          url: `https://wakatime.com/api/v1/users/current/summaries?start=${startDate}&end=${endDate}&api_key=${apiKey}`,
        });
        let tempData = data.data.map((el) => {
          return {
            date: el.range.text,
            totalTime: el.grand_total.text,
            projects: el.projects,
          };
        });
        const result = {
          username,
          data: tempData,
        };

        fs.writeFileSync(`./data/${username}-${endDate}.json`, JSON.stringify(result, null, 2));
      } catch (err) {
        console.log(err);
      }
    });
  } catch (err) {
    console.log(err);
  }
};

const fullDate = new Date();
const date = fullDate.getDate();
const month = fullDate.getMonth() + 1;
const year = fullDate.getFullYear();
const detail = {
  startDate: `${year}-${month}-${date - 14}`,
  endDate: `${year}-${month}-${date}`,
};

const users = [
  { username: "", apiKey: "" },
];

hitWakatime(detail, users);
