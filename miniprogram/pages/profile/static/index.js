export const privacy = `<h2>隐私政策</h2>
<h3>个人信息</h3>
<p><strong>本应用目前云端服务器不存储任何个人信息，统一身份认证系统的账号与密码存储在微信小程序的本地端。</strong>应用与服务器传输过程经过加密。</p>
<p>本应用尊重并保护所有使用服务用户的个人隐私权。为了给您提供更准确、更有个性化的服务，本应用会按照本隐私权政策的规定使用和披露您的个人信息。但本应用将以高度的勤勉、审慎义务对待这些信息。除本隐私权政策另有规定外，在未征得您事先许可的情况下，本应用不会将这些信息对外披露或向第三方提供。本应用会不时更新本隐私权政策。 您在同意本应用服务使用协议之时，即视为您已经同意本隐私权政策全部内容。本隐私权政策属于本应用服务使用协议不可分割的一部分。</p>
<h2 data-breakpage>功能说明</h2>
<h3>课程表功能</h3>
<ol>
<li>为保证学校课程与自定义课程不丢失，不含个人信息的课程信息会保存在云端，若您想立即更新课程表，重新登录即可。</li>
<li>如果您在登录HAUTDAYS后更改了统一认证密码，请重新登录HAUTDAYS以保证本地缓存密码与教务系统同步。</li>
<li>课程表信息只能保证与教务系统的课程安排一致，<strong>如遇学校临时更改课程安排的情况，课程表无法同步</strong>，敬请谅解。</li>
<li>获取到的课程会备份到小程序的数据库中,以后每次显示的都是备份的课表,所以当原课表更新时,需要手动的重新获取一次</li>
<li>自定义的课表只会保存到备份数据库中,不会影响原课表,如果重新导入课表,<strong>不会消失</strong></li>
<li>自定义课表只会保留一学期</li>
</ol>
<h3>成绩相关功能</h3>
<ol>
<li><p>目前平均绩点的计算公式为 </p>
<ul>
<li>含公选课：除去重修课项, ( ( 科目绩点 * 学分)之和 /  学分之和 )</li>
<li>补考：所有数据带补考字样的信息不计入到绩点之中</li>
</ul>
</li>
<li><p>成绩相关功能的分析数据，仅供参考</p>
</li>

</ol>
<h3>考试安排功能</h3>
<ol>
<li>由于考试安排基本在学期末才会发出,所以每次打开小程序并不会更新,只有当点开"考试安排"功能后才会更新并保存到本地<strong>如果本地已经存在,则不会更新,请手动点击"更新"按钮,获取最新信息</strong></li>

</ol>
<p><strong>HAUTDAYS开发者对上述功能拥有最终解释权。</strong></p>
`
export const menus = [
  {
    icon: 'manager',
    title: '账户与数据',
    label: '导入/更新课程表',
    url: '/pages/login/login'
  },
  {
    icon: 'delete',
    title: '清除缓存',
    label: '显示出现异常时请尝试清除缓存',
    url: ''
  },
  {
    icon: 'like',
    title: '个性设置',
    url: ''
  },
  {
    icon: 'comment-circle',
    title: '意见反馈',
    url: '',
    openType: 'feedback'
  },
  {
    icon: 'chat',
    title: '联系客服',
    url: '',
    openType: 'contact'
  },
  {
    icon: 'umbrella-circle',
    title: '用户服务条款',
    url: ''
  },
  {
    icon: 'more',
    title: '关于',
    value: 'pithy',
    url: ''
  }
]
export const about = `
<h2>HAUT DAYS</h2>
<p>"HAUTDAYS(学在工大)"是一款面向和河南工业大学的非学校官方的微信小程序版教务系统，集合了学生<strong>最常使用</strong>的功能。</p>
<p>课表、成绩等数据来自教务处官网</p>
<p>此小程序由校内学生开发,目前由本人维护中,如有问题反馈或建议可以通过点击"联系客服"找到我
</p>
<img src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-6a55c234-d419-42b9-98d8-4733827bec98/c0fd8d12-dff8-4427-9cee-70cf6a2f37a2.png" width="100%"/>
`
