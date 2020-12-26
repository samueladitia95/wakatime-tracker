"use strict";

const axios = require("axios");
const fs = require("fs");

const fullDate = new Date();
const date = fullDate.getDate();
const month = fullDate.getMonth() + 1;
const year = fullDate.getFullYear();
const daysRecord = 7; //! How many days the api fetch
const dateDetail = {
  startDate: `${year}-${month}-${date - daysRecord}`,
  endDate: `${year}-${month}-${date}`,
};

const users = [
  //! put all api key in here
  //! username can be anything, is just placeholder to identify api key
  { username: "", apiKey: "" },
];

const hitWakatime = (dateDetail, users) => {
  const { startDate, endDate } = dateDetail;
  users.forEach(async (user) => {
    try {
      const { username, apiKey } = user;
      const { data } = await axios({
        method: "get",
        url: `https://wakatime.com/api/v1/users/current/summaries?start=${startDate}&end=${endDate}&api_key=${apiKey}&timeout=10`,
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
};

hitWakatime(dateDetail, users);
