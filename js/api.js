var API = (() => {
  const BASE_URL = "https://study.duyiedu.com"; //常用网值
  const TOKEN_KEY = "token"; //令牌
  //封装相同代码
  async function get(path) {
    //获取路径封装
    const headers = {}; //fetch第二个参数；
    const token = localStorage.getItem(TOKEN_KEY); //读取本地保存的令牌
    
    if (token) {
      headers.authorization = `Bearer ${token}`;
    }
    return fetch(BASE_URL + path, { headers });
  }
  
  async function post(path, bodyobj) {
    //请求路径封装
    const headers = {
      //请求头
      "Content-Type": `application/json`,
    };
    const token = localStorage.getItem(TOKEN_KEY); //读取本地保存的令牌
    if (token) {
      headers.authorization = `Bearer ${token}`;
    }
    return fetch(BASE_URL + path, {
      headers,
      method: "POST",
      body: JSON.stringify(bodyobj),
    });
  }
  //注册ID
  async function reg(userInfo) {
    const result = await post("/api/user/reg", userInfo);
    return await result.json();
  }
  //登录id
  async function login(loginInfo) {
    const results = await post("/api/user/login", loginInfo);
    const body = await results.json();
    if (body.code === 0) {
      //登录成功保存令牌
      const token = results.headers.get("authorization"); //获取Promise响应头里的令牌
      localStorage.setItem(TOKEN_KEY, token);//保存本地
    }
    return body;
  }
  //验证账号
  async function exists(loginId) {
    const result = await get("/api/user/exists?loginId=" + loginId);
    return await result.json();
  }
  //当前用户信息
  async function profile() {
    const result = await get(`/api/user/profile`);
    return await result.json();
  }
  //发送聊天信息
  async function chat(content) {
    const result = await post(`/api/chat`, { content });
    return await result.json();
  }
  //获取聊天记录
  async function history() {
    const result = await get(`/api/chat/history`);
    return await result.json();
  }
  //注销本地令牌 保证注销用户
  function loginOut() {
    localStorage.removeItem(TOKEN_KEY);
  }

  return {
    reg,
    login,
    exists,
    profile,
    chat,
    history,
    loginOut,
  };



  // //注册
  // reg({
  //   loginId: "abcd",
  //   nickname: "哈哈哈哈",
  //   loginPwd: "123123",
  // }).then((result) => console.log(result));

  // //登录
  // login({
  //   loginId: "abcd",
  //   loginPwd: "123123",
  // }).then((item) => console.log(item));

  // //验证账号
  // exists({
  //   loginId: "guagua",
  // }).then((result) => console.log(result));

  // //验证用户
  // profile().then((result) => console.log(result));

  // //发送聊天信息
  // chat("你几岁了").then((result) => console.log(result));

  // //获取聊天记录
  // history().then((result) => console.log(result));
})();