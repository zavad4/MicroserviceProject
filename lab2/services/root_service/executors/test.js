const wdo = require('../wdo.js');

const analyzeReq = (url) => new Promise(async (resolve) => {
  const startTime = Date.now();
  const { err } = await wdo.get(url);
  const endTime = Date.now();
  const time = endTime - startTime;
  resolve({ time, ok: !err });
});

const makeCalls = async () => {
  //const reqArrToSecondSvc = new Array(100).fill(analyzeReq('http://www.google.com/'));
  const res1 = await Promise.all(new Array(10).fill(1).map(() => analyzeReq('http://www.google.com/')))

    // const arr1 = [];
    // for (let i = 0; i < 100; i++) {
    //   arr1.push(analyzeReq('http://www.google.com/'))
    // }

  const res2 = await Promise.all(new Array(10).fill(1).map(() => analyzeReq('http://www.google.com/')));
  let res = {
    api: {
      avg: 0,
      fail: 0,
    },
    dbc: {
      avg: 0,
      fail: 0,
    },
  };

  const t1 = res1.map(el => el.time);
  const t2 = res2.map(el => el.time);
  const err1 = res1.map(el => el.err);
  const err2 = res2.map(el => el.err);
  const t1Avg = t1.reduce((acc, val) => acc += val) / t1.length;
  const t2Avg = t2.reduce((acc, val) => acc += val) / t2.length;

  console.log(res1)
  res.api.avg = t1Avg + 'ms';
  res.dbc.avg = t2Avg + 'ms';
  res.api.fail = err1.filter(err => err).length;
  res.dbc.fail = err2.filter(err => err).length;

  return { data: res, err: null };
};



(async () => {
    console.log(await makeCalls())
})()