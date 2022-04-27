const moment = require("moment");

const SHUTTLE_DATA = {
  "-LXcJzZkD2g9OG50q5pt": {
    name: "이공관 행",
    status: true,
    order: 1,
    stations: {
      Ah7lO0GS9M: {
        name: "기흥역 4번출구",
        descript: "memo 1",
        status: true,
        order: 1,
        schedule: [],
      },
      VOF5o1gUfn: {
        name: "사훈 프라자 앞",
        descript: "memo 1",
        status: true,
        order: 2,
        schedule: [],
      },
    },
  },
  LXcMXSvfscGRDynikKK: {
    name: "기흥역 행",
    status: true,
    order: 2,
    stations: {
      zbIclI1pzD: {
        name: "이공관 (기흥역)",
        descript: "memo 1",
        status: true,
        order: 1,
        schedule: [],
      },
    },
  },
  LngYBAM1VGgvR7hrTYf: {
    name: "기흥역 행",
    status: true,
    order: 3,
    stations: {
      rIowOloH4l: {
        name: "이공관 (사훈 프라자)",
        descript: "memo 1",
        status: true,
        order: 1,
        schedule: [],
      },
    },
  },
  "Not enough minerals": {
    name: "12시 방향",
    status: true,
    order: 4,
    dev: true,
    stations: {
      Bunker1: {
        name: "일연벙",
        descript: "memo 1",
        status: true,
        order: 1,
        schedule: ["09:00:00", "09:30:00", "20:40:00", "23:59:59"],
      },
      Bunker2: {
        name: "이연벙",
        descript: "memo 2",
        status: false,
        order: 2,
        schedule: ["00:00:00"],
      },
      Bunker3: {
        name: "삼연벙",
        descript: "memo 3",
        status: true,
        order: 3,
        schedule: ["09:00:00"],
      },
      Bunker4: {
        name: "사연벙",
        descript: "memo 4",
        status: true,
        order: 4,
        schedule: ["00:00:00"],
      },
      Bunker5: {
        name: "오연벙",
        descript: "memo 5",
        status: true,
        order: 5,
        schedule: [],
      },
    },
  },
  "Spawn more overlords": {
    name: "6시 방향",
    status: false,
    order: 5,
    dev: true,
    stations: {
      Hatchery: {
        name: "해처리",
        descript: "memo 5",
        status: true,
        order: 1,
        schedule: [],
      },
    },
  },
};

const convertLoadedData = function (data) {
  const shuttleData = {};
  data.forEach((row) => {
    const route_key = `route_${row.ksrid}`;
    if (!shuttleData.hasOwnProperty(route_key)) {
      shuttleData[route_key] = {
        name: row.route_name,
        status: row.route_status,
        order: row.route_order_num,
        dev: false,
        stations: {},
      };
    }

    shuttleData[route_key].stations[`station_${row.kssid}`] = {
      name: row.station_name,
      descript: row.descript,
      status: row.station_status,
      order: row.station_order_num,
      schedule: JSON.parse(row.timeline),
    };
  });
  //   console.log("shuttleData", shuttleData);
  return shuttleData;
};

const loadFromDB = async function () {
  const mariadb = require("mariadb");
  const pool = mariadb.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASENAME || "chatbot_system",
    port: process.env.DB_PORT || "3306",
    connectionLimit: 5,
  });

  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query("SELECT * FROM `knu_shuttle_info`");
    // rows: [ {val: 1}, meta: ... ]
    // console.log("rows", rows);
    return Promise.resolve(convertLoadedData(rows));
  } catch (e) {
    return Promise.reject(
      new Error(`Error while load data from db: ${e.message}`)
    );
  } finally {
    if (conn) conn.release(); //release to pool
  }
};

const loadShuttleData = async function (isDev = false) {
  if (isDev) {
    return Promise.resolve(SHUTTLE_DATA);
  }
  return loadFromDB();
};

const getShuttleRouteData = async function (isDev = false) {
  const result = [];
  const shuttleData = await loadShuttleData(isDev);
  for (let key in shuttleData) {
    if (shuttleData[key].status && shuttleData[key].dev == isDev) {
      result.push({
        name: shuttleData[key].name,
        order: shuttleData[key].order,
        key,
      });
    }
  }
  return result;
};

const routeName2RouteKey = function (shuttleData, routeName) {
  let routeKey = null;
  Object.keys(shuttleData).forEach((key) => {
    if (shuttleData[key].name === routeName) {
      routeKey = key;
    }
  });
  return routeKey;
};

const getShuttleStationList = async function (routeName, isDev = false) {
  const result = [];
  const shuttleData = await loadShuttleData(isDev);
  const route = routeName2RouteKey(shuttleData, routeName);
  if (
    !shuttleData.hasOwnProperty(route) ||
    !shuttleData[route].stations ||
    !shuttleData[route].status ||
    shuttleData[route].dev !== isDev
  ) {
    return null;
  }

  const stations = shuttleData[route].stations;

  for (let key in stations) {
    if (stations[key].status) {
      result.push({
        name: stations[key].name,
        order: stations[key].order,
        schedule: stations[key].schedule,
        descript: stations[key].descript,
        key,
      });
    }
  }
  return result;
};

const calcNearestTime = function (time, schedule, idx = 0) {
  if (!/^([\d]{2}[\:]?){3}$/g.exec(time) || !schedule) {
    return {
      msg: "NA",
      idx: 0,
    };
  }
  if (schedule.length <= 0) {
    return {
      msg: "운행 정보 없음",
      idx: 0,
    };
  }

  // console.log('calc', time, idx, schedule)

  // calc nearest
  for (let i = idx; i < schedule.length; i++) {
    const diff = moment(schedule[i], "HH:mm:ss").diff(moment(time, "HH:mm:ss"));
    // console.log('diff', schedule[i], time, diff, moment(time, 'HH:mm:ss'), moment(time, 'HH:mm:ss').diff(moment(schedule[i], 'HH:mm:ss')))
    // console.log('range', schedule[i - 1], time, schedule[i])

    if (60000 <= Math.abs(diff) && Math.abs(diff) <= 600000 && diff > 0) {
      // 1 ~ 10분 전
      return {
        msg: `${Math.floor(Math.abs(diff) / 60000)}분 후 출발`,
        idx: i,
      };
    } else if (0 <= diff && Math.abs(diff) < 60000) {
      // 잠시후
      return {
        msg: "잠시후 출발",
        idx: i,
      };
    } else if (
      (0 < i && (schedule[i - 1] || "00:00:00") < time && time < schedule[i]) ||
      (idx !== 0 && time < schedule[i])
    ) {
      // 통상 시간 범위
      return {
        msg: `${idx === 0 ? "이번" : "다음"} ${schedule[i]}`,
        idx: i,
      };
    } else if (i === 0 && time < schedule[i]) {
      // 첫차 전
      return {
        msg: `첫차 ${schedule[i]}`,
        idx: i,
      };
    } else if (i === schedule.length && schedule[i] < time) {
      // 막차 놓침
      return {
        msg: `첫차 ${schedule[0]}`,
        idx: i,
      };
    }
  }
  return {
    msg: idx === 0 ? "운행종료" : `첫차 ${schedule[0]}`,
    idx: 0,
  };
};

const calcNearestTimeSummary = function (time, schedule) {
  const { msg: nearMsg, idx: nearIdx } = calcNearestTime(time, schedule);
  // console.log('near', nearMsg, nearIdx)
  const { msg: nextMsg, idx: _ } = calcNearestTime(time, schedule, nearIdx + 1);
  // console.log('next', nextMsg, _)
  return `${nearMsg} / ${nextMsg}`;
};

const getNearestShuttleData = async function (route, time, isDev = false) {
  const stations = await getShuttleStationList(route, isDev);
  // console.log(stations)
  const result = [];
  if (!/^([\d]{2}[\:]?){3}$/g.exec(time) || !stations) {
    return result;
  }

  stations.forEach((station) => {
    result.push({
      name: station.name,
      order: station.order,
      msg: calcNearestTimeSummary(time, station.schedule),
    });
  });
  return result;
};

const getRouteNameFromKey = async function (key, isDev = false) {
  const shuttleData = await loadShuttleData(isDev);
  if (!shuttleData.hasOwnProperty(key)) {
    return "NA";
  }
  return shuttleData[key].name;
};

module.exports = {
  SHUTTLE_DATA,
  getShuttleRouteData,
  getShuttleStationList,
  getNearestShuttleData,
  getRouteNameFromKey,
};
