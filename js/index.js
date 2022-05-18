(async () => {
    //验证当前用户是否已经登录，没有登陆跳转回登录页面
    const resp = await API.profile();
    const user = resp.data;
    if (!user) {
        alert("未登录或者登录已经过期，请重新登录");
        location.href = `./login.html`; //相对html页面路径
        return;
    }
    //这是已经登录的状态
    //先获取dom元素
    const doms = {
        aside: {
            //侧边栏提示元素
            nickname: $("#nickname"),
            loginId: $("#loginId"),
        },
        close: $(".close"),
        chat: $(".chat-container"),
        form: $("form"),
        ipt: $("#txtMsg"),
    };
    //结构元素
    const {
        aside: { nickname, loginId },
        close,
        chat,
        form,
        ipt,
    } = doms;
    //设置用户信息
    const setUserInfo = () => {
        //注意关于登录注册这块 尽量都用innerText 因为用户输入信息无法信任；避免出现元素紊乱
        nickname.innerText = user.nickname;
        loginId.innerText = user.loginId;
    };
    setUserInfo();
    //叉叉事件
    close.onclick = function () {
        //删除令牌 跳转回登陆页面
        API.loginOut();
        location.href = "./login.html";
    };
    //发送聊天信息s
    form.onsubmit = function (e) {
        e.preventDefault();
        sendMessage();
    };
    //添加信息 机器人和用户
    const addChat = (chatInfo) => {
        //创建信息元素
        const div = $$$("div");
        div.className = "chat-item";
        if (chatInfo.from) {
            div.classList.add("me");
        }

        const img = $$$("img");
        img.className = "chat-avatar";
        img.src = chatInfo.from ? "./asset/avatar.png" : "./asset/robot-avatar.jpg";

        const content = $$$("div");
        content.className = "chat-content";
        content.innerText = chatInfo.content;

        const time = $$$("div");
        time.className = "chat-date";
        time.innerText = formatDate(chatInfo.createdAt);
        div.appendChild(img);
        div.appendChild(content);
        div.appendChild(time);
        chat.appendChild(div);
    };
    //时间函数
    const formatDate = (dates) => {
        const date = new Date(dates);
        let year = date.getFullYear().toString().padStart(2, "0");
        let mother = (date.getMonth() + 1).toString().padStart(2, "0");
        let day = date.getDate().toString().padStart(2, "0");
        let week = date.getDay();
        let hour = date.getHours().toString().padStart(2, "0");
        let minute = date.getMinutes().toString().padStart(2, "0");
        let second = date.getSeconds().toString().padStart(2, "0");
        var millisecond = date.getMilliseconds();
        let arr = [
            "星期天",
            "星期一",
            "星期二",
            "星期三",
            "星期四",
            "星期五",
            "星期六",
        ];
        return `${year}年${mother}月${day}号${arr[week]}  ${hour}小时${minute}分${second}`;
    };
    //加载历史记录
    async function historys() {
        const respt = await API.history();
        console.log(respt);
        for (const item of respt.data) {
            addChat(item);
        }
        scorllT();
    }
    await historys();
    //滚动条滚动到最后
    function scorllT() {
        chat.scrollTop = chat.scrollHeight;
    }
    //发送信息函数
    async function sendMessage() {
        const content = ipt.value.trim();
        if (!content) {
            return
        }
        //发送信息时先让用户界面直接刷新的到发送出的页面，让用户不觉得时卡顿
        addChat({
            from: user.loginId,
            to: null,
            createdAt: +new Date(),
            content: content,
        })
        //发送后马上清空
        ipt.value = '';
        //并且跳转至最下页面
        scorllT();
        const respt = await API.chat(content);
        console.log(respt);
        //机器人回复语
        addChat({
            from: null,
            to: user.loginId,
            ...respt.data//传入机器人回复对象
        });
        scorllT();
    }
})();
