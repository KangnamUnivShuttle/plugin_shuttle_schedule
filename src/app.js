const express = require("express");
const bodyParser = require("body-parser");

require("dotenv").config();
const app = express();

// application/json
app.use(express.json());

// application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const axios = require("axios");
const {
  errorResponse,
  carouselTemplate,
  listTemplate,
  listItem,
  basicCardTemplate,
  buttonItem,
  successResponse,
} = require("./lib");

const { ERROR_UNEXPECTED_METHOD, ERROR_UNEXPECTED_ROUTE } = require("./global");

const {
  SHUTTLE_DATA,
  getShuttleRouteData,
  getShuttleStationList,
  getNearestShuttleData,
  getRouteNameFromKey,
} = require("./db");

app.post("/chat", async (req, res) => {
  if (
    !req.body["method"] ||
    !["route", "stations", "neartime"].includes(req.body["method"])
  ) {
    errorResponse.template.outputs[0].simpleText.text = ERROR_UNEXPECTED_METHOD;
    res.send(errorResponse);
    return;
  }

  switch (req.body["method"]) {
    case "route":
      const routes = await getShuttleRouteData(req.body.dev || false);

      carouselTemplate.carousel.type = "basicCard";
      basicCardTemplate.title = "셔틀 버스 행선지 선택";
      basicCardTemplate.description = "이동하려는 행선지를 선택하세요";

      const sortedRoutes = routes.sort((a, b) => a.order - b.order);

      for (let i = 0; i < sortedRoutes.length; i++) {
        buttonItem.label = sortedRoutes[i].name;
        buttonItem.messageText = `${sortedRoutes[i].name}`;
        basicCardTemplate.buttons.push(buttonItem);
        if (i % 3 === 2 || i === sortedRoutes.length - 1) {
          carouselTemplate.carousel.items.push(
            JSON.parse(JSON.stringify(basicCardTemplate))
          );
          basicCardTemplate.buttons.length = 0;
        }
      }
      break;
    case "stations":
      const stations = await getShuttleStationList(
        req.body.route,
        req.body.dev || false
      );

      if (!stations) {
        errorResponse.template.outputs[0].simpleText.text =
          ERROR_UNEXPECTED_ROUTE;
        res.send(errorResponse);
        return;
      }

      carouselTemplate.carousel.type = "listCard";
      listTemplate.header.title = `${await getRouteNameFromKey(
        req.body.route,
        req.body.dev
      )} 경로`;

      const sortedStations = stations.sort((a, b) => a.order - b.order);

      for (let i = 0; i < sortedStations.length; i++) {
        listItem.title = sortedStations[i].name;
        listItem.description = sortedStations[i].descript;
        listTemplate.items.push(JSON.parse(JSON.stringify(listItem)));

        if (i % 5 === 4 || i === sortedStations.length - 1) {
          carouselTemplate.carousel.items.push(
            JSON.parse(JSON.stringify(listTemplate))
          );
          listTemplate.items.length = 0;
        }
      }
      break;
    case "neartime":
      const neartime = await getNearestShuttleData(
        req.body.route,
        req.body.time,
        req.body.dev || false
      );
      carouselTemplate.carousel.type = "listCard";
      listTemplate.header.title = `${await getRouteNameFromKey(
        req.body.route,
        req.body.dev
      )} 경로`;
      // console.log('neartime', neartime)

      const sortedNearTime = neartime.sort((a, b) => a.order - b.order);

      for (let i = 0; i < sortedNearTime.length; i++) {
        listItem.title = sortedNearTime[i].name;
        listItem.description = sortedNearTime[i].msg;
        listTemplate.items.push(JSON.parse(JSON.stringify(listItem)));

        if (i % 5 === 4 || i === sortedNearTime.length - 1) {
          carouselTemplate.carousel.items.push(
            JSON.parse(JSON.stringify(listTemplate))
          );
          listTemplate.items.length = 0;
        }
      }

      break;
  }

  successResponse.template.outputs.push(carouselTemplate);
  res.send(successResponse);
  carouselTemplate.carousel.items.length = 0;
  successResponse.template.outputs.length = 0;
});

module.exports = app;
