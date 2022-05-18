const loginIdValue = new FieldValidator("txtLoginId",  function (value) {
  if (!value) {
    return `请输入账号`;
  }
});
const loginPwd = new FieldValidator("txtLoginPwd", function (value) {
  if (!value) {
    return `请填写密码`;
  }
});

//统一验证
const form = $('.user-form');
//提交事件
form.onsubmit = async function (e) {
    //阻止form的默认行为
    e.preventDefault();
    const result = await FieldValidator.validates(
        //调用静态方法
        loginIdValue,
        loginPwd,
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
    const data = await API.login(results);//验证账号密码
    if (data.code === 0) {
        alert("登录成功");
        location.href = "./index.html";
    } else {
        alert("账号或者密码错误");
        loginPwd.input.value = '';
    }
}