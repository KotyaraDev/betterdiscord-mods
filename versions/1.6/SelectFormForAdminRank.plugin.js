/**
 * @name SelectFormForAdminRank
 * @author Котяра
 * @authorId 701903800302305371
 * @description Готовые формы для админ-рангов
 * @source https://github.com/KotyaraDev/betterdiscord-mods/blob/main/SelectFormForAdminRank.plugin.js
 * @updateUrl https://raw.githubusercontent.com/KotyaraDev/betterdiscord-mods/main/SelectFormForAdminRank.plugin.js
 * @website https://github.com/KotyaraDev/betterdiscord-mods/tree/main/
 * @version 1.6
 */

"use strict";
const fs = require("fs");
const path = require('path');
const request = require("request");
const config = {
  version: {
    "base": "1.6",
  },
  base_url: "https://raw.githubusercontent.com/KotyaraDev/betterdiscord-mods/main",
}
const PluginSettings = {UpdateSystem: true};

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
var Formats = [];
var Servers = [];
var Post = [];
var Rank = [];
var Mark = [];
let checkUpdateIntervalID;

function ShowFormModal({ rootProps }) {
  const [format, setFormat] = useState("");
  const [server, setServer] = useState("");
  const [post, setPost] = useState("");
  const [rank, setRank] = useState("");
  const [mark, setMark] = useState("");
  const [formReason, setReason] = useState("");

  const [formatted, rendered] = useMemo(() => {
    const selectedFormat = Formats.find((f) => f.title === format);
    return [(selectedFormat) ? selectedFormat : "---", format];
  }, [format]);


  function getResult(type = false) {
    if (type) {
      var result = "---";

      switch (format) {
        case "Откат дейcтвия":
        {
          result = formatted.value.replace("{{reason}}", formReason);
          break;
        }
        case "Прошёл проверку НКВД":
        {
          result = formatted.value.replace("{{post}}", post).replace("{{reason}}", formReason);
          break;
        }
        case "Прошёл обучение":
        {
          result = formatted.value.replace("{{post}}", post).replace("{{reason}}", formReason);
          break;
        }
        case "Повышен в ранге":
        {
          result = formatted.value.replace("{{post}}", post).replace("{{rank}}", rank);
          break;
        }
        case "Принят в отдел (ЛС-ВС)":
        {
          result = formatted.value.replace("{{post}}", post).replace("{{reason}}", formReason).replace("{{rank}}", rank);
          break;
        }
        case "Перевод в отдел Дневной/Ночной":
        {
          result = formatted.value.replace("{{post}}", post);
          break;
        }
        case "Снятие с поста":
        {
          result = formatted.value.replace("{{post}}", post).replace("{{reason}}", formReason);
          break;
        }
        case "Выдать устное(ые) предупреждение(я)":
        {
          result = formatted.value.replace("{{post}}", post).replace("{{reason}}", formReason);
          break;
        }
        case "Выдать предупреждение(я)":
        {
          result = formatted.value.replace("{{post}}", post).replace("{{reason}}", formReason);
          break;
        }
        case "Снять предупреждение(я)":
        {
          result = formatted.value.replace("{{post}}", post).replace("{{reason}}", formReason);
          break;
        }
        case "Выдать выговор(ы)":
        {
          result = formatted.value.replace("{{post}}", post).replace("{{reason}}", formReason);
          break;
        }
        case "Снять выговор(ы)":
        {
          result = formatted.value.replace("{{post}}", post).replace("{{reason}}", formReason);
          break;
        }
        case "Выдать отпуск":
        {
          result = formatted.value.replace("{{post}}", post).replace("{{reason}}", formReason);
          break;
        }
        case "Снять отпуск":
        {
          result = formatted.value.replace("{{post}}", post).replace("{{reason}}", formReason);
          break;
        }
        case "Выдать метку":
        {
          result = formatted.value.replace("{{post}}", post).replace("{{mark}}", mark).replace("{{reason}}", formReason);
          break;
        }
        case "Выдать рекомендацию":
        {
          result = formatted.value.replace("{{post}}", post).replace("{{reason}}", formReason);
          break;
        }
        case "Сгорает рекомендация":
        {
          result = formatted.value.replace("{{post}}", post).replace("{{reason}}", formReason);
          break;
        }
        case "Выдать соц. рейтинг":
        {
          result = formatted.value.replace("{{reason}}", formReason);
          break;
        }
        case "Снять соц. рейтинг":
        {
          result = formatted.value.replace("{{reason}}", formReason);
          break;
        }
        case "Выдать грань снятии":
        {
          result = formatted.value.replace("{{post}}", post).replace("{{reason}}", formReason);
          break;
        }
        case "Снять грань снятии":
        {
          result = formatted.value.replace("{{post}}", post).replace("{{reason}}", formReason);
          break;
        }
  
        case "Выдача банов":
        {
          result = formatted.value.replace("{{server}}", server).replace("{{reason}}", formReason).replace("{{timestamp}}", Math.floor(Date.now() / 1000));
          break;
        }
      
        default:
        {
          result = formatted.value
          break;
        }
      }
    } else {
      var result = false;

      switch (format) {
        case "Откат дейcтвия":
        {
          result = true;
          break;
        }
        case "Принят в отдел (ЛС-ВС)":
        {
          result = true;
          break;
        }
        case "Снятие с поста":
        {
          result = true;
          break;
        }
        case "Выдать устное(ые) предупреждение(я)":
        {
          result = true;
          break;
        }
        case "Выдать предупреждение(я)":
        {
          result = true;
          break;
        }
        case "Снять предупреждение(я)":
        {
          result = true;
          break;
        }
        case "Выдать выговор(ы)":
        {
          result = true;
          break;
        }
        case "Снять выговор(ы)":
        {
          result = true;
          break;
        }
        case "Выдать отпуск":
        {
          result = true;
          break;
        }
        case "Снять отпуск":
        {
          result = true;
          break;
        }
        case "Выдать метку":
        {
          result = true;
          break;
        }
        case "Выдать рекомендацию":
        {
          result = true;
          break;
        }
        case "Закончилась рекомендация":
        {
          result = true;
          break;
        }
        case "Выдать соц. рейтинг":
        {
          result = true;
          break;
        }
        case "Снять соц. рейтинг":
        {
          result = true;
          break;
        }
        case "Выдать грань снятии":
        {
          result = true;
          break;
        }
        case "Снять грань снятии":
        {
          result = true;
          break;
        }

        case "Выдача банов":
        {
          result = true;
          break;
        }
      
        default:
        {
          result = false;
          break;
        }
      }
    }

    return result;
  }

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
      { className: cl("modal-content") }, BdApi.React.createElement(FormTitle, null, ""),
      BdApi.React.createElement(
        Select,
        {
          placeholder: "Выберите форму",
          options: Formats.map((m) => ({
            label: typeof m === "object" ? m.title : m,
            value: typeof m === "object" ? m.title : m,
            disabled: typeof m === "object" ? m.disabled : m
          })),
          isSelected: (v) => format === v,
          select: (v) => setFormat(v),
          serialize: (v) => v,
          renderOptionLabel: (o) =>
            BdApi.React.createElement("div", { className: cl("format-label") }, o.label),
          renderOptionValue: () => rendered
        }
      ),
      (format == "Выдача банов") ? BdApi.React.createElement(
        Select,
        {
          placeholder: "Выберите сервер",
          options: Servers.map((m) => ({
            label: typeof m === "object" ? m.name : m,
            value: typeof m === "object" ? m.name : m,
            disabled: typeof m === "object" ? m.disabled : m
          })),
          isSelected: (v) => server === v,
          select: (v) => setServer(v),
          serialize: (v) => v,
          renderOptionLabel: (o) =>
            BdApi.React.createElement("div", { className: cl("format-label") }, o.label),
          renderOptionValue: () => server,
        }
      ) : null,
      (format == "Прошёл проверку НКВД" && format == "Прошёл обучение" && format == "Принят в отдел (ЛС-ВС)" && format == "Повышен в ранге" && format == "Снятие с поста" && format == "Перевод в отдел Дневной/Ночной" && format == "Выдать устное(ые) предупреждение(я)" && format == "Выдать предупреждение(я)" && format == "Снять предупреждение(я)" && format == "Выдать выговор(ы)" && format == "Снять выговор(ы)" && format == "Выдать отпуск" && format == "Снять отпуск" && format == "Выдать метку" && format == "Выдать рекомендацию" && format == "Сгорает рекомендация" && format == "Выдать грань снятии" && format == "Снять грань снятии") ? BdApi.React.createElement(
        Select,
        {
          placeholder: "Выберите должность человека",
          options: Post.map((m) => ({
            label: typeof m === "object" ? m.name : m,
            value: typeof m === "object" ? m.name : m,
            disabled: typeof m === "object" ? m.disabled : m
          })),
          isSelected: (v) => post === v,
          select: (v) => setPost(v),
          serialize: (v) => v,
          renderOptionLabel: (o) =>
            BdApi.React.createElement("div", { className: cl("format-label") }, o.label),
          renderOptionValue: () => post,
        }
      ) : null,
      (format == "Прошёл обучение" || format == "Повышен в ранге" || format == "Принят в отдел (ЛС-ВС)") ? BdApi.React.createElement(
        Select,
        {
          placeholder: "Выберите ранг",
          options: Rank.map((m) => ({
            label: typeof m === "object" ? m.name : m,
            value: typeof m === "object" ? m.name : m,
            disabled: typeof m === "object" ? m.disabled : m
          })),
          isSelected: (v) => rank === v,
          select: (v) => setRank(v),
          serialize: (v) => v,
          renderOptionLabel: (o) =>
            BdApi.React.createElement("div", { className: cl("format-label") }, o.label),
          renderOptionValue: () => rank,
        }
      ) : null,
      (format == "Выдать метку") ? BdApi.React.createElement(
        Select,
        {
          placeholder: "Выберите метку",
          options: Mark.map((m) => ({
            label: typeof m === "object" ? m.name : m,
            value: typeof m === "object" ? m.name : m,
            disabled: typeof m === "object" ? m.disabled : m
          })),
          isSelected: (v) => mark === v,
          select: (v) => setMark(v),
          serialize: (v) => v,
          renderOptionLabel: (o) =>
            BdApi.React.createElement("div", { className: cl("format-label") }, o.label),
          renderOptionValue: () => mark,
        }
      ) : null,
      (getResult()) ? BdApi.React.createElement(
        "input",
        {
          type: "text",
          placeholder: "Введите причину",
          onChange: (v) => setReason(v['target'].value),
        }
      ) : null,
    ),
    BdApi.React.createElement(
      ModalFooter,
      null,
      BdApi.React.createElement(
        Button,
        {
          disabled: ((formatted.value == "---" || !formatted.value) ? true : false),
          onClick: () => {
            const ComponentDispatch = BdApi.Webpack.getModule((m) => m.emitter?._events?.INSERT_TEXT, {
              searchExports: true
            });
            ComponentDispatch.dispatchToLastSubscribed("INSERT_TEXT", {
              rawText: getResult(true),
              plainText: getResult(true)
            });
            rootProps.onClose();
          }
        },
        "Вставить"
      )
    )
  );
}


function ShowCreateFormModal({ rootProps }) {
  const [name, setName] = useState("");
  const [format, setFormat] = useState("");

  return BdApi.React.createElement(
    ModalRoot,
    { ...rootProps },
    BdApi.React.createElement(
      ModalHeader,
      { className: cl("modal-header") },
      BdApi.React.createElement(FormTitle, { tag: "h2" }, "Создание новой формы"),
      BdApi.React.createElement(ModalCloseButton, { onClick: rootProps.onClose })
    ),
    BdApi.React.createElement(
      ModalContent,
      { className: cl("modal-content") }, BdApi.React.createElement(FormTitle, null, ""),
      BdApi.React.createElement(
        "input",
        {
          type: "text",
          placeholder: "Введите название формы (ДОЛЖНО БЫТЬ УНИКАЛЬНЫМ!)",
          onChange: (v) => setName(v['target'].value),
        }
      ),
      BdApi.React.createElement(
        "div",
        {
          className: "markdown",
          style: {
            
            padding: "10px",
            borderRadius: "5px",
            marginButton: "1rem",
            width: "386px",
            height: "500px",
            whiteSpace: "pre-wrap",
            background: "#1E1F22",
            color: "#D1D4D7",
          },
          contentEditable: true,
          onInput: (e) => setFormat(e.target.innerText),
        }, "Введите текст формы (доступно использования форматирования дискорд, так-же для переноса строки используйте клавишу ` Space `(Пробел))"
      )
    ),
    BdApi.React.createElement(
      ModalFooter,
      null,
      BdApi.React.createElement(
        Button,
        {
          disabled: ((!name || !format) ? true : false),
          onClick: () => {
            const customFormFields = BdApi.getData("SelectFormForAdminRank", "forms");
            const newForm = {
                title: name,
                value: format,
                disabled: false,
            };
            customFormFields.push(newForm);
            BdApi.setData("SelectFormForAdminRank", "forms", customFormFields);
            rootProps.onClose();
            
            BdApi.showToast("Начинаем перезагружать кастомные формы\nПожалуйста подождите..", {type: "info"});

            setTimeout(() => {
              loadForms(true);

              setTimeout(() => {
                loadCustomForms(true);
              }, 1500);
            }, 2500);
          }
        },
        "Создать"
      )
    )
  );
}

function ChatBarComponent() {
  return BdApi.React.createElement(Tooltip, { text: "Открыть панель форм" }, ({ onMouseEnter, onMouseLeave }) => BdApi.React.createElement("div", { style: { marginTop: 10 } }, BdApi.React.createElement(
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

function checkUpdate(curr_version, thisIsIntervalCheck = false) {
  request.get(
    config.base_url+"/configs.json",
    (error, response, body) => {
      if (error) {
        BdApi.showToast(error, { type: "error" });
        return;
      }

      if (response.statusCode == 200) {
        const versionData = JSON.parse(body.toString());
        const new_versions = versionData['select-forms'];

        if (new_versions && new_versions.length > 0) {
          var latestVersion = '1.0';
          var changelogs = '---';
          
          for (let i = 0; i < new_versions.length; i++) {
            if (new_versions[i].versions > curr_version) {
              latestVersion = new_versions[i].versions;
              changelogs = new_versions[i].changelogs;

              break;
            }
          }
          

          if (curr_version < latestVersion) {
            BdApi.showConfirmationModal(
              "SelectFormForAdminRank | Новое обновление!",
              `Ваша версия: \`${curr_version}\` | Новая версия: \`${latestVersion}\`\n\n\`СПИСОК ИЗМЕНЕНИЙ:\`\n\n${changelogs}\n\n> *\`ВАЖНО!\` Если вы заметили ошибки, баги, недоработки или что-либо подобное, пожалуйста, сообщите о них __@kotyarakryt__*`,
              {
                confirmText: "Установить",
                cancelText: "Отменить",
                onConfirm: () => {
                  BdApi.showToast("Начинаем загрузку обновления..", { type: "info" });

                  request.get(
                    config.base_url+"/versions/"+latestVersion+"/SelectFormForAdminRank.plugin.js",
                    (error, response, body) => {
                      if (error) {
                        BdApi.showToast(`Ошибка при загрузке: ${error}`, { type: "error" });
                        return false;
                      }

                      if (response.statusCode == 200) {
                        fs.writeFileSync(
                          path.join(BdApi.Plugins.folder, "SelectFormForAdminRank.plugin.js"),
                          body
                        );

                        BdApi.showToast(`Обновление загружено!`, { type: "success" });
                      } else {
                        BdApi.showToast(`Ошибка при установке обновления.`, { type: "warning" });
                      }
                    }
                  );
                },
              }
            );
          } else {
            if (thisIsIntervalCheck) {
              BdApi.showToast("Обновлений не найдено, пожалуйста, попробуйте позже!", { type: "error" });
            }
          }
        }
      }
    }
  );
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

function loadForms(refresh = false) {
  request.get(
    config.base_url+"/selections.json",
    (error, response, body) => {
      if (error) {
        BdApi.showToast(error, { type: "error" });
        return;
      }
      
      if (response.statusCode == 200) {
        const result = JSON.parse(body.toString());

        const base = (result['standart']) ? result['standart'].data : 0;
        const serv = (result['servers']) ? result['servers'].data : 0;
        const post = (result['post']) ? result['post'].data : 0;
        const rank = (result['rank']) ? result['rank'].data : 0;
        const mark = (result['mark']) ? result['mark'].data : 0;

        
        BdApi.showToast("Начинаем загрузку форм..", {type: "info"});

        if (base.length > 0) {
          for (let i = 0; i < base.length; i++) {
            if (i == 0 && refresh) {
              Formats = [];
            }

            Formats.push({
              "title": base[i]['title'],
              "value": base[i]['value'],
              "disabled": base[i]['disabled'],
            });
          }
        }
        if (serv.length > 0) {
          for (let i = 0; i < serv.length; i++) {
            Servers.push({
              "name": serv[i]['name'],
              "disabled": serv[i]['disabled'],
            });
          }
        }
        if (post.length > 0) {
          for (let i = 0; i < post.length; i++) {
            Post.push({
              "name": post[i]['name'],
              "disabled": post[i]['disabled'],
            });
          }
        }
        if (rank.length > 0) {
          for (let i = 0; i < rank.length; i++) {
            Rank.push({
              "name": rank[i]['name'],
              "disabled": rank[i]['disabled'],
            });
          }
        }
        if (mark.length > 0) {
          for (let i = 0; i < mark.length; i++) {
            Mark.push({
              "name": mark[i]['name'],
              "disabled": mark[i]['disabled'],
            });
          }
        }

        // CUSTOM FORM`S
        if (fs.existsSync(BdApi.Plugins.folder+"\\"+"SelectFormForAdminRank.config.json")) {
          fs.readFile(BdApi.Plugins.folder+"\\"+"SelectFormForAdminRank.config.json", 'utf8', function(err, data) {
            if (err) {
              setTimeout(() => {
                BdApi.showToast("Кастомные форма не загружены!\n"+err, { type: "error" })
              }, 500);
              console.log(err);

              return;
            }
  
            if (data == "{}" || data['forms'] == "[]" || !data) {
              setTimeout(() => {
                BdApi.showToast("Кастомные форма не настроены!", { type: "error" })
              }, 500);
              
              return;
            } else {
              const form = JSON.parse(data)['forms'];

              if (form.length > 0) {
                console.log(form.length);

                for (let i = 0; i < form.length; i++) {
                  const existingIndex = Formats.findIndex(item => item.title === form[i]['title']);

                  if (existingIndex === -1) {
                    Formats.push({
                      "title": form[i]['title'],
                      "value": form[i]['value'],
                      "disabled": form[i]['disabled'],
                    });
                  }
                }
              }
            }
          });
        } else {
          loadCustomForms(true);
        }

        
        setTimeout(() => {
          if (refresh) {
            BdApi.showToast("Формы успешно перезагружены!", { type: "success" });
          } else {
            BdApi.showToast("Формы успешно загружены!", { type: "success" });
          }
        }, 500);
      } else {
        BdApi.showToast(`Формы не загружены!\nСообщите об этом разработчику: @kotyarakryt`, { type: "error" });
      }
    }
  );
}

function loadCustomForms(notify = false) {
  const standartCustomForm = {
    "forms": [
      {
        "title": "Пример 1",
        "value": "Примерочная форма #1",
        "disabled": false
      },
      {
        "title": "Пример 2",
        "value": "Примерочная форма #2",
        "disabled": false
      }
    ]
  }

  // LOAD CUSTOM FORM`S
  if (!fs.existsSync(BdApi.Plugins.folder+"\\"+"SelectFormForAdminRank.config.json")) {
    fs.writeFile(BdApi.Plugins.folder+"\\"+"SelectFormForAdminRank.config.json", JSON.stringify(standartCustomForm, null, 2), (err) => {
      if (err) {
        setTimeout(() => {
          if (notify) {
            BdApi.showToast("Ошибка при создании файла", { type: "error" });
          }
        }, 1500);

        return false;
      }


      if (notify) {
        BdApi.showToast("Файл конфигураций не найден! Начинаем создавать его..", { type: "warning" });
      }

      return false;
    });
  } else {
    BdApi.showToast("Начинаем загрузку кастомных форм..", {type: "info"});

    setTimeout(() => {
      fs.readFile(BdApi.Plugins.folder+"\\"+"SelectFormForAdminRank.config.json", 'utf8', function(err, data) {
        if (err) {
          setTimeout(() => {
            if (notify) {
              BdApi.showToast("Кастомные форма не загружены!\n"+err, { type: "error" });
            }
          }, 1500);
          console.log(err);

          return;
        }

        if (data == "{}" || data['forms'] == "[]" || !data ) {
          setTimeout(() => {
            if (notify) {
              BdApi.showToast("Кастомные форма не настроены!", { type: "error" });
            }
          }, 1500);

          return;
        } else {
          const form = JSON.parse(data)['forms'];
  
          if (form.length > 0) {
            for (let i = 0; i < form.length; i++) {
              Formats.push({
                "title": form[i]['title'],
                "value": form[i]['value'],
                "disabled": form[i]['disabled'],
              });
            }
          }
        }
      });
    }, 300);

    if(notify) {
      setTimeout(() => {
        BdApi.showToast("Кастомные формы успешно загружены!", { type: "success" });
      }, 500);
    }

    return true;
  }
}

function clearFormData() {
  const customFormFields = BdApi.getData("SelectFormForAdminRank", "forms");
  if (Array.isArray(customFormFields)) {
    customFormFields.length = 0;
    BdApi.setData("SelectFormForAdminRank", "forms", customFormFields);
  }
  BdApi.showToast("Все кастомные форма были очищены!", { type: "warning" });
  setTimeout(() => {
    loadForms(true);

    setTimeout(() => {
      loadCustomForms(true);
    }, 1500);
  }, 1000);
}

var Chat = BdApi.Webpack.getModule((m) => m.Z?.type?.render?.toString().includes("chat input type must be set"));

module.exports = meta => {
  return {
    load: () => {
      Object.assign(PluginSettings, BdApi.Data.load(meta.name, "settings"));

      if (PluginSettings["UpdateSystem"]) {
        checkUpdate(config.version['base']);
      }

      setTimeout(() => {
        loadForms();
      }, 100);
    },
    start: () => {
      Object.assign(PluginSettings, BdApi.Data.load(meta.name, "settings"));

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
    },
    stop: () => {
      BdApi.DOM.removeStyle("vbd-st");
      BdApi.Patcher.unpatchAll("vbd-st");

      clearInterval(checkUpdateIntervalID);
    },
    getSettingsPanel: () => {
      const SettingsPanel = document.createElement("div");
      SettingsPanel.style.textAlign = "center";
      SettingsPanel.id = "settings";
  
      const createFormButton = document.createElement("button");
      createFormButton.style.position = "relative";
      createFormButton.style.background = "#444";
      createFormButton.style.color = "#fff";
      createFormButton.style.textDecoration = "none";
      createFormButton.style.textTransform = "uppercase";
      createFormButton.style.border = "none";
      createFormButton.style.borderRadius = "5px";
      createFormButton.style.letterSpacing = "0.1rem";
      createFormButton.style.fontSize = "1rem";
      createFormButton.style.padding = "1rem 3rem";
      createFormButton.style.transition = "0.2s";
      createFormButton.textContent = "Создать новую форму";
      createFormButton.addEventListener("click", () => openModal((props) => BdApi.React.createElement(ShowCreateFormModal, { rootProps: props })));
      SettingsPanel.appendChild(createFormButton);


      const deleteFormButton = document.createElement("button");
      deleteFormButton.style.position = "relative";
      deleteFormButton.style.background = "#4a0000";
      deleteFormButton.style.color = "#fff";
      deleteFormButton.style.textDecoration = "none";
      deleteFormButton.style.textTransform = "uppercase";
      deleteFormButton.style.border = "none";
      deleteFormButton.style.borderRadius = "5px";
      deleteFormButton.style.letterSpacing = "0.1rem";
      deleteFormButton.style.fontSize = "1rem";
      deleteFormButton.style.padding = "1rem 3rem";
      deleteFormButton.style.marginTop = "5px";
      deleteFormButton.textContent = "Очистить всех кастомные формы";
      deleteFormButton.addEventListener("click", () => clearFormData());
      SettingsPanel.appendChild(deleteFormButton);

      const checkUpdateFormButton = document.createElement("button");
      checkUpdateFormButton.style.position = "relative";
      checkUpdateFormButton.style.background = "#005089";
      checkUpdateFormButton.style.color = "#fff";
      checkUpdateFormButton.style.textDecoration = "none";
      checkUpdateFormButton.style.textTransform = "uppercase";
      checkUpdateFormButton.style.border = "none";
      checkUpdateFormButton.style.borderRadius = "5px";
      checkUpdateFormButton.style.letterSpacing = "0.1rem";
      checkUpdateFormButton.style.fontSize = "1rem";
      checkUpdateFormButton.style.padding = "1rem 3rem";
      checkUpdateFormButton.style.marginTop = "5px";
      checkUpdateFormButton.textContent = "Проверить на наличие обновлений";
      checkUpdateFormButton.addEventListener("click", () => checkUpdate(config.version['base'], true));
      SettingsPanel.appendChild(checkUpdateFormButton);

      const restartPluginDiv = document.createElement("div");
      restartPluginDiv.style.position = "relative";
      restartPluginDiv.style.marginTop = "15px";

      const restartPluginCheckbox = document.createElement("input");
      restartPluginCheckbox.type = "checkbox";
      restartPluginCheckbox.id = "restartPluginCheckbox";
      restartPluginCheckbox.checked = (PluginSettings["UpdateSystem"]) ? true : false;

      restartPluginDiv.appendChild(restartPluginCheckbox);
      SettingsPanel.appendChild(restartPluginDiv);

      const label = document.createElement("label");
      label.setAttribute("for", "restartPluginCheckbox");
      label.style.position = "relative";
      label.textContent = `Предлагать новые обновления | ${((PluginSettings["UpdateSystem"]) ? 'ВКЛ' : 'ВЫКЛ')}`;
      SettingsPanel.appendChild(label);

      const checkboxStyle = `
        opacity: 0;
        color: #fff;
      `;

      restartPluginCheckbox.style.cssText = checkboxStyle;

      const labelStyleOFF = `
        position: relative;
        background: #cd3232;
        color: #fff;
        text-decoration: none;
        text-transform: uppercase;
        border: none;
        border-radius: 5px;
        letter-spacing: 0.1rem;
        font-size: 1rem;
        padding: 1rem 3rem;
        margin-top: 15px;
      `;
      const labelStyleON = `
        position: relative;
        background: #32CD32;
        color: #fff;
        text-decoration: none;
        text-transform: uppercase;
        border: none;
        border-radius: 5px;
        letter-spacing: 0.1rem;
        font-size: 1rem;
        padding: 1rem 3rem;
        margin-top: 15px;
      `;

      label.style.cssText = (PluginSettings["UpdateSystem"]) ? labelStyleON : labelStyleOFF;


      restartPluginCheckbox.addEventListener("change", function () {
          if (this.checked) {
            label.style.cssText = labelStyleON;
            label.textContent = "Предлагать новые обновления | ВКЛ";
            PluginSettings["UpdateSystem"] = true;

            BdApi.showToast("Предложение об обновлении, будет отображаться при запуске плагина!", { type: "success" });
          } else {
            label.style.cssText = labelStyleOFF;
            label.textContent = "Предлагать новые обновления | ВЫКЛ";
            PluginSettings["UpdateSystem"] = false;

            BdApi.showToast("Предложение об обновлении, больше не будет отображаться при запуске плагина!", { type: "warning" });
          }

          
          BdApi.Data.save(meta.name, "settings", PluginSettings);
      });

      return SettingsPanel;
    }
  }
};