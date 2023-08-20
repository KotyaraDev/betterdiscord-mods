/**
 * @name SelectFormForAdminRank
 * @author Котяра
 * @authorId 701903800302305371
 * @description Готовые формы для админ-рангов
 * @source https://github.com/KotyaraDev/betterdiscord-mods/blob/main/SelectFormForAdminRank.plugin.js
 * @updateUrl https://raw.githubusercontent.com/KotyaraDev/betterdiscord-mods/main/SelectFormForAdminRank.plugin.js
 * @website https://github.com/KotyaraDev/betterdiscord-mods/tree/main/
 * @version 1.1
 */

"use strict";
const request = require("request");
const config = {
  version: "1.1",
  urls: [
    "https://raw.githubusercontent.com/KotyaraDev/betterdiscord-mods/main/configs.json",
    "https://raw.githubusercontent.com/KotyaraDev/betterdiscord-mods/main/SelectFormForAdminRank.plugin.js",
  ],
}

var { useState, useMemo } = BdApi.React;
var {
    Button,
    ModalRoot,
    ModalHeader,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    FormTitle,
    FormText,
    Tooltip,
    Select,
    openModal
} = BdApi.Webpack.getModule((m) => m.ModalContent);

var ButtonWrapperClasses = BdApi.Webpack.getModule((m) => m.buttonWrapper && m.buttonContent);
var cl = (...names) => names.map((n) => `vbd-its-${n}`).join(" ");
var Formats = [
  "---",
  {
    text: ">>> UPD: Откат\n* Причина: \`\`",
    value: "Откат дейтвия"
  },
  {
    text: ">>> Игрок @ принят на пост дневного/ночного модератора\n\n* Данные:\n * Discord: ` `\n * Ник/SteamID: ` `\n * Соц. Рейтинг: ` `\nТребуется обучение: @\nТребуется проверка: @",
    value: "Прошёл Набор"
  },
  {
    text: ">>> Игрок @ прошёл проверку НКВД",
    value: "Прошёл НКВД"
  },
  {
    text: ">>> Игрок @ прошёл обучение\n*Испытательный срок: `7 дней`\n\n* Требуется:\n * Выдать роли\n * Выдать ранг (`STEAMID` | `moderator`)\n<@&890637093003481138><@&890607376074412082>",
    value: "Прошёл Обучение"
  },
  {
    text: ">>> Кандидат на ЛС @ принят в отдел `OTDEL`\n* Причина: ` `\n*Ипытательный срок: `7 дней`\n\n* Требуется:\n * Выдать роли\n * Выдать ранг (`STEAMID` | `RANK`)\n<@&890637093003481138><@&890607376074412082>",
    value: "Принят в отдел (ЛС-ВС)"
  },
  {
    text: ">>> Модератор @ повышен до `RANG`\n* Требуется:\n * Выдать ранг `STEAMID`\n<@&890637093003481138><@&890607376074412082>",
    value: "Повышен в ранге"
  },
  {
    text: ">>> Модератор @ снят\n* Причина: ` `\n* Чёрный-Список: ` `\n\n* Статистика:\n * Наказания: ` `\n * Соц. рейтинг: ` `\n * ОВНДП: ` `\n * Жалоб: ` `\n * Часов: ` `",
    value: "Снятие с поста"
  },
  {
    text: ">>> Модератор @ получает **NUMBER устное предупреждение**\n* Причина: \`\`",
    value: "Выдать уст. предупреждение"
  },
  {
    text: ">>> Модератор @ получает **NUMBER  предупреждение(я)**\n* Причина: \`\`",
    value: "Выдать предупреждение(я)"
  },
  {
    text: ">>> Модератор @ снимает **NUMBER предупреждение(я)**\n* Причина: \`\`",
    value: "Снять предупреждение(я)"
  },
  {
    text: ">>> Модератор @ получает **NUMBER выговор(ы)**\n* Причина: \`\`",
    value: "Выдать выговор(ы)"
  },
  {
    text: ">>> Модератор @ снимает **NUMBER выговор(ы)**\n* Причина: \`\`",
    value: "Снять выговор(ы)"
  },
  {
    text: ">>> Модератор @ получает отпуск/заморозку (`полный/частичный`) с: **DATA** по: **DATA**\n* Причина: \`\`",
    value: "Выдать отпуск / заморозку"
  },
  {
    text: ">>> Модератор @ выходит с отпуска/заморозки\n* Причина: \`\`\n* Требуется занести в таблицу: Пинг сотрудников дневной/ночной администрации",
    value: "Снять отпуск / заморозку"
  },
  {
    text: ">>> Модератор @ получает **METKA** метку\n* Причина: \`\`",
    value: "Выдать метку"
  },
  {
    text: ">>> Модератор @ получает рекомендацию\n* Причина: \`\`",
    value: "Выдать рекомендацию"
  },
  {
    text: ">>> Модератор @ сгорает рекомендация\n* Причина: \`\`",
    value: "Закончилась рекомендация"
  },
  {
    text: ">>> Модератор @ +NUMBER соц. рейтинга\n* Причина: \`\`",
    value: "Выдать соц. рейтинг"
  },
  {
    text: ">>> Модератор @ -NUMBER соц. рейтинга\n* Причина: \`\`",
    value: "Снять соц. рейтинг"
  },
  {
    text: ">>> Модератор @ получает грань снятия с: **DATA** до: **DATA**\nПричина: \`\`",
    value: "Выдать грань снятии"
  },
  // {
  //   text: "---",
  //   value: "Снять грань снятии"
  // },
  // {
  //   text: "---",
  //   value: "Отправляется в командировку"
  // },
  // {
  //   text: "---",
  //   value: "Возвращается с командировки"
  // }
];

function ShowFormModal({ rootProps }) {
  const [format, setFormat] = useState("");
  const [formatted, rendered] = useMemo(() => {
    const selectedFormat = Formats.find((f) => f.value === format);
    return [selectedFormat ? selectedFormat.text : "---", format];
  }, [format]);

  return BdApi.React.createElement(
    ModalRoot,
    { ...rootProps },
    BdApi.React.createElement(
      ModalHeader,
      { className: cl("modal-header") },
      BdApi.React.createElement(FormTitle, { tag: "h2" }, "Выбор формы"),
      BdApi.React.createElement(ModalCloseButton, { onClick: rootProps.onClose })
    ),
    BdApi.React.createElement(
      ModalContent,
      { className: cl("modal-content") },
      // BdApi.React.createElement(FormTitle, null, "Формы"),
      BdApi.React.createElement(FormTitle, null, ""),
      BdApi.React.createElement(
        Select,
        {
          options: Formats.map((m) => ({
            label: typeof m === "object" ? m.value : m,
            value: typeof m === "object" ? m.value : m
          })),
          isSelected: (v) => format === v,
          select: (v) => setFormat(v),
          serialize: (v) => v,
          renderOptionLabel: (o) =>
            BdApi.React.createElement("div", { className: cl("format-label") }, o.label),
          renderOptionValue: () => rendered
        }
      ),
      // BdApi.React.createElement(FormTitle, { className: cl("preview-title") }, "Предварительный просмотр"),
      // BdApi.React.createElement(
      //   FormText,
      //   { className: cl("preview-text") },
      //   `${rendered || "---"} | ${formatted || "---"}`,
      // )
    ),
    BdApi.React.createElement(
      ModalFooter,
      null,
      BdApi.React.createElement(
        Button,
        {
          disabled: (formatted == "---" || !formatted) ? true : false,
          onClick: () => {
            const ComponentDispatch = BdApi.Webpack.getModule((m) => m.emitter?._events?.INSERT_TEXT, {
              searchExports: true
            });
            ComponentDispatch.dispatchToLastSubscribed("INSERT_TEXT", {
              rawText: formatted,
              plainText: formatted
            });
            rootProps.onClose();
          }
        },
        "Вставить"
      )
    )
  );
}

function ChatBarComponent() {
  return BdApi.React.createElement(Tooltip, { text: "Выбрать форму" }, ({ onMouseEnter, onMouseLeave }) => BdApi.React.createElement("div", { style: { marginTop: 10 } }, BdApi.React.createElement(
    Button,
    {
      "aria-haspopup": "dialog",
      "aria-label": "",
      size: "",
      look: Button.Looks.BLANK,
      onMouseEnter,
      onMouseLeave,
      innerClassName: ButtonWrapperClasses.button,
      onClick: () => {
        openModal((props) => BdApi.React.createElement(ShowFormModal, { rootProps: props }));
      },
      className: cl("button")
    },
    BdApi.React.createElement("div", { className: ButtonWrapperClasses.buttonWrapper }, BdApi.React.createElement("svg", { "aria-hidden": "true", role: "img", width: "24", height: "24", viewBox: "0 0 24 24" }, BdApi.React.createElement("g", { fill: "none", "fill-rule": "evenodd" }, BdApi.React.createElement(
      "path",
      {
        fill: "orange",
        d: "M22 12L12.101 2.10101L10.686 3.51401L12.101 4.92901L7.15096 9.87801V9.88001L5.73596 8.46501L4.32196 9.88001L8.56496 14.122L2.90796 19.778L4.32196 21.192L9.97896 15.536L14.222 19.778L15.636 18.364L14.222 16.95L19.171 12H19.172L20.586 13.414L22 12Z"
      }
    ), BdApi.React.createElement("rect", { width: "24", height: "24" }))))
  )));
}

function findInReactTree(root, filter) {
  return BdApi.Utils.findInTree(root, filter, {
    walkable: ["children", "props"]
  });
}

var styles_default = `.vbd-its-modal-content input {
    background-color: var(--input-background);
    color: var(--text-normal);
    width: 95%;
    padding: 8px 8px 8px 12px;
    margin: 1em 0;
    outline: none;
    border: 1px solid var(--input-background);
    border-radius: 4px;
    font-weight: 500;
    font-style: inherit;
    font-size: 100%;
}

.vbd-its-format-label,
.vbd-its-format-label span {
    background-color: transparent;
}

.vbd-its-modal-content [class|="select"] {
    margin-bottom: 1em;
}

.vbd-its-modal-content [class|="select"] span {
    background-color: var(--input-background);
}

.vbd-its-modal-header {
    justify-content: space-between;
    align-content: center;
}

.vbd-its-modal-header h1 {
    margin: 0;
}

.vbd-its-modal-header button {
    padding: 0;
}

.vbd-its-preview-text {
    margin-bottom: 1em;
}

.vbd-its-button {
    padding: 0 6px;
}

.vbd-its-button svg {
    transform: scale(1.1) translateY(1px);
}
`;

function load() {
  request.get(
    config.urls[0],
    (error, response, body) => {
      if (error) {
        BdApi.showToast(error, { type: "error" });
        return;
      }
      
      if (response.statusCode == 200) {
        const versionData = JSON.parse(body.toString());
        
        const old_version = config.version;
        const new_version = versionData.versions['select-forms'];
        const changelogs = versionData.changelogs['select-forms'];
        if (old_version < new_version) {
          BdApi.showConfirmationModal(
            "SelectFormForAdminRank | Новое обновление!",
            `Ваша версия: \`${old_version}\` | Новая версия: \`${new_version}\`\n\n \n\n\`СПИСОК ИЗМЕНЕНИЙ:\`\n\n${changelogs}`,
            {
              confirmText: "Установить",
              cancelText: "Отменить",
              onConfirm: () => {
                BdApi.showToast("Начинаем загрузку..", {type: "info"});

                request.get(
                  "https://raw.githubusercontent.com/KotyaraDev/betterdiscord-mods/main/SelectFormForAdminRank.plugin.js",
                  (error, response, body) => {
                    if (error) {
                      BdApi.showToast(`Ошибка при загрузка: ${error}`, { type: "error" });
                      return;
                    }

                    if (response.statusCode == 200) {
                      fs.writeFileSync(
                        path.join(BdApi.Plugins.folder, "SelectFormForAdminRank.plugin.js"),
                        body
                      );
                      
                      BdApi.showToast(`Обновление успешно загружено!`, { type: "info" });
                    } else BdApi.showToast(`Ошибка при установке обновления.`, { type: "warning" });
                  }
                );
              }
            }
          );
        }
      }
    }
  );
}

var Chat = BdApi.Webpack.getModule((m) => m.Z?.type?.render?.toString().includes("chat input type must be set"));
function start() {
  BdApi.DOM.addStyle("vbd-st", styles_default);
  BdApi.Patcher.after("vbd-st", Chat.Z.type, "render", (_this, _args, res) => {
    const chatBar = findInReactTree(
      res,
      (n) => Array.isArray(n?.children) && n.children.some((c) => c?.props?.className?.startsWith("attachButton"))
    )?.children;
    if (!chatBar) {
      console.error("SelectFormForAdminRank: Couldn't find ChatBar component in React tree");
      return;
    }
    const buttons = findInReactTree(chatBar, (n) => n?.props?.showCharacterCount);
    if (buttons?.props.disabled)
      return;
    chatBar.splice(-1, 0, BdApi.React.createElement(ChatBarComponent, null));
  });
}
function stop() {
  BdApi.DOM.removeStyle("vbd-st");
  BdApi.Patcher.unpatchAll("vbd-st");
}

module.exports = _ => ({
  load,
  start,
  stop
});