import oil_manage from "@images/icons/oil_manage.png";
import open_card from "@images/icons/open_card.png";
import contact_service from "@images/icons/contact_service.png";
import out_login from "@images/icons/out_login.png";
export const list = [
  {
    name: "油卡管理",
    className:"oil-manage",
    imgUrl: oil_manage,
    url: "../oil-card-list/oil-card-list"
  },
  {
    name: "开卡",
    imgUrl: open_card,
    className:"open-card",
    url: "../card/open"
  },
  {
    name: "联系客服",
    imgUrl: contact_service,
    className:"contact-service",
    url: "contact"
  },
  {
    name: "退出登录",
    imgUrl: out_login,
    className:"out-login",
    itemClass:'no-border',
    url: "out"
  }
];
