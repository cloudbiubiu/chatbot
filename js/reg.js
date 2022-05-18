//验证账号 没有值为空时输出
const loginIdValue = new FieldValidator("txtLoginId", async function (value) {
      if (!value) {
        return `请输入账号`;
      }
      const result = await API.exists(value); //根据服务器确定账号是否存在
      if (result.data) {
        //账号存在
        return `该账号已经存在`;
      }
}
);
//填写昵称
const loginId = new FieldValidator("txtNickname", function (value) {
  if (!value) {
    return `请填写昵称`;
  }
});
//争对密码的验证
const loginPwd = new FieldValidator("txtLoginPwd", function (value) {
     if (!value) {
       return `请填写密码`;
     }
});
//确认密码的验证规则
const loginPwdIsOk = new FieldValidator("txtLoginPwdConfirm", function (value) {
    if (!value) {
      return "请填写确认密码";
    }
    if (value !== loginPwd.input.value) {
      return `两次验证密码不一致`;
    }
}
);

//统一验证
const form = $('.user-form');
//提交事件
form.onsubmit = async function (e) {
    //阻止form的默认行为
    e.preventDefault();
    const result = await FieldValidator.validates(
        //调用静态方法
        loginIdValue,
        loginId,
        loginPwd,
        loginPwdIsOk
  );
    if (!result) {
        return; //验证未通过
    }
    //注册账号 方法一手动传入对象
    //   const data = await API.reg({
    //     loginId: loginIdValue.input.value,
    //     nickname: loginId.input.value,
    //     loginPwd: loginPwd.input.value,
    //   });
  //方法二
    const formData = new FormData(form); //这个方法根据form表单中的name属性拿到一个迭代器
    const results = Object.fromEntries(formData.entries()); //form.entries()得到一个[["a",1],["b",2]]迭代器数组的键值对，在用这个Object.fromEntries方法还原成一个对象
    const data = await API.reg(results);//验证账号密码
    if (data.code === 0) {
        alert("注册成功");
        location.href = "./login.html";
    }
}