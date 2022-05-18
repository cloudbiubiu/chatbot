/**
 * 对某个表单进行验证的构造函数（类）
 */
class FieldValidator {
  /**
   * 构造器
   * @param {String} txtId 文本框的id
   * @param {Function} validatorFunc 验证规则函数 当需要的对该文本框进行验证的时候就可以调用此函数
   */
  constructor(txtId, validatorFunc) {
    this.input = $("#" + txtId); //验证当前输入的文本框
    this.p = this.input.nextElementSibling; //当前文本框的p元素
    this.validatorFunc = validatorFunc; //保存当前验证函数的值 方便静态方法调用
    this.input.onblur = () => {
      //失去焦点事件
      this.validate();
    };
    this.input.oninput = () => {
      //输入时提示文件消失
      this.validate();
    };
  }
  /**
   * 验证，成功返回ture，失败返回falss
   * 因为会等待网络数据所以该函数是异步代码
   */
  async validate() {
    //validate验证的意思
    if (this.input.value) {
      this.p.innerText = "";
    }
    const err = await this.validatorFunc(this.input.value); //传入这次验证的数据
    if (err) {
      //有值有错误
      this.p.innerText = err;
      return false;
    } else {
      //没有错误
      this.p.innerText = "";
      return true;
    }
  }
  /**
   * 静态方法 对所有的验证器进行验证 所有通过才通过 一个没通过都不通过
   * @param {FieldValidator[]} validators
   */
  static async validates(...validators) {
    //这个是静态方法和原型方法不一样不用实列就可以调用
    const promise = validators.map((item) => item.validate());
    console.log(promise);
    const result = await Promise.all(promise); //等带所有异步代码完成后
    console.log(result);
    return result.every((item) => item); //筛选数组是否通过
  }
}
































// //验证账号 没有值为空时输出
// const loginIdValue = new FieldValidator('txtLoginId',
//     async (value) => {
//     if (!value) {
//         return `请输入账号`;
//     }
//     const result = await API.exists(value);//根据服务器确定账号是否存在
//         if (result.data) {
//         //账号存在
//         return `该账号已经存在`
//     }
// })
// //填写昵称
// const loginId = new FieldValidator("txtNickname", async (value) => {
//     if (!value) {
//         return `请填写昵称`;
//     }
// });
// function test() {
//   FieldValidator.validates(loginIdValue, loginId).then(
//     (result) => console.log(result))
// ;
// }
