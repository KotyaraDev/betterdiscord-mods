/**
 * @description Плагин предоставляет набор готовых форм, специально разработанных для использования в админ-рангах. Этот инструмент позволяет быстро и удобно создавать и настраивать необходимые формы, снижая время и усилия, необходимые для этого процесса. Набор форм включает в себя опции для выбора сервера, ранга, метки, причины, а также другие полезные возможности, обеспечивая адаптивность и удобство использования.
 * @name SelectFormForAdminRankBeta
 * @version 2.1
 * @author Котяра
 * @invite ZaNnGGNDWb
 * @source https://github.com/KotyaraDev/betterdiscord-mods
 * @website https://discord.gg/cloudgaming
 * @api https://raw.githubusercontent.com/KotyaraDev/betterdiscord-mods/main
 * @build stable
*/

"use strict";
const fs = require("fs");
const path = require('path');
const request = require("request");

const mainConfig = {
    api: {
        url: "https://raw.githubusercontent.com/KotyaraDev/betterdiscord-mods/main",
        config: "/configs.json",
        data: "/selections.json",
        versions: "SelectFormForAdminRankBeta/versions/",
    },
    version: "1.0",
    build: "stable",

    name: "SelectFormForAdminRankBeta",
}

var { useState, useMemo } = BdApi.React;
var { Button, ModalRoot, ModalHeader, ModalCloseButton, ModalContent, ModalFooter, FormTitle, FormText, Tooltip, Select, Input, openModal } = BdApi.Webpack.getModule((m) => m.ModalContent);
var ButtonWrapperClasses = BdApi.Webpack.getModule((m) => m.buttonWrapper && m.buttonContent);
var cl = (...names) => names.map((n) => `vbd-its-${n}`).join(" ");

const mainData = {
    Formats: [], Servers: [], Doljs: [], Ranks: [], Marks: [], Departments: [], Partia: []
};




/*
    [ MODALS ]
*/
function ShowFormModal({ rootProps }) {
    try {
        const [formData, setFormData] = useState({
            // BASE
            forma: "", server: "", dolj: "", rank: "", mark: "", depart: "", partia: "",

            // OTHER
            reason: "", number: "", trial: "",
        });

        const [formaObj, rendered] = useMemo(() => {
            const selectedFormat = mainData['Formats'].find((f) => f.name === formData.forma);
            return [(selectedFormat) ? selectedFormat : "---", formData.forma];
        }, [formData.forma]);

        const handleFormDataChange = (fieldName, value = null) => (value !== null) && setFormData(prevData => ({ ...prevData, [fieldName]: value }));


        let FormsOptions = [];
        if(mainData['Formats'].length === 0) FormsOptions.push({ label: "======!> { Нет форм } <!======", value: "---", disabled: true });
        else FormsOptions = mainData['Formats'].map((m) => ({ label: typeof m === "object" ? m.name : m, value: typeof m === "object" ? m.name : m, disabled: typeof m === "object" ? m.disabled : m }));


        let data = [];
        if(formaObj.value != null || formaObj != "---") {
            const selectOptions = [
                // Select
                { key: "server", placeholder: "Выберите сервер", type: "Select", source: mainData['Servers'], isSelected: (v) => formData.server === v, select: (v) => handleFormDataChange("server", v), serialize: (v) => v },
                { key: "dolj", placeholder: "Выберите должность", type: "Select", source: mainData['Doljs'], isSelected: (v) => formData.dolj === v, select: (v) => handleFormDataChange("dolj", v), serialize: (v) => v },
                { key: "rank", placeholder: "Выберите ранг", type: "Select", source: mainData['Ranks'], isSelected: (v) => formData.rank === v, select: (v) => handleFormDataChange("rank", v), serialize: (v) => v },
                { key: "mark", placeholder: "Выберите метку", type: "Select", source: mainData['Marks'], isSelected: (v) => formData.mark === v, select: (v) => handleFormDataChange("mark", v), serialize: (v) => v },
                { key: "depart", placeholder: "Выберите отдел", type: "Select", source: mainData['Departments'], isSelected: (v) => formData.depart === v, select: (v) => handleFormDataChange("depart", v), serialize: (v) => v },
                { key: "partia", placeholder: "Выберите отдел (Партийная форма)", type: "Select", source: mainData['Partia'], isSelected: (v) => formData.partia === v, select: (v) => handleFormDataChange("partia", v), serialize: (v) => v },
                // Input
                { key: "reason", placeholder: "Введите причину", type: "Input", input_type: "text" },
                { key: "number", placeholder: "Введите количество", type: "Input", input_type: "number" },
                { key: "trial", placeholder: "На сколько исп. срок? (в днях)", type: "Input", input_type: "number" },
            ];

            const generateComponent = (option, isSelectedFn, selectFn, serializeFn) => {
                var componentProps = null;

                switch (option.type) {
                    case "Select":
                    {
                        componentProps = {
                            placeholder: option.placeholder,
                            options: option.source.map((m) => ({ label: typeof m === "object" ? m.name : m, value: typeof m === "object" ? m.name : m, disabled: typeof m === "object" ? m.disabled : m })),
                            isSelected: isSelectedFn,
                            select: selectFn,
                            serialize: serializeFn,
                            renderOptionLabel: (o) => BdApi.React.createElement("div", { className: cl("format-label") }, o.label),
                            renderOptionValue: () => formData[option.key]
                        };
                        break;
                    }
                
                    case "Input":
                    {
                        componentProps = {
                            type: (option.input_type) ? option.input_type : "text",
                            placeholder: option.placeholder,
                            onChange: (v) => handleFormDataChange(option.key, v['target'].value),
                        };
                        break;
                    }
                }
            
                if (option.type !== "Select") return BdApi.React.createElement(`${option.type}`, { ...componentProps });
                else return BdApi.React.createElement(Select, { ...componentProps });
            };

            selectOptions.forEach((option) => {
                if(formaObj.value.includes(`{{${option.key}}}`)) {
                    data.push(generateComponent(option, option.isSelected, option.select, option.serialize));
                    data.push(BdApi.React.createElement(FormTitle, null, ""));
                }
            });
        }

        return BdApi.React.createElement(
            ModalRoot, { ...rootProps },
            BdApi.React.createElement(
                ModalHeader, { className: cl("modal-header") },
                BdApi.React.createElement(FormTitle, { tag: "h2" }, "Выбор формы"),
                BdApi.React.createElement(ModalCloseButton, { onClick: rootProps.onClose })
            ),
            BdApi.React.createElement(
                ModalContent, { className: cl("modal-content") }, BdApi.React.createElement(FormTitle, null, ""),
                BdApi.React.createElement(
                    Select,
                    {
                        placeholder: "Выберите форму",
                        options: FormsOptions,
                        isSelected: (v) => formData.forma === v,
                        select: (v) => handleFormDataChange("forma", v),
                        serialize: (v) => v,
                        renderOptionLabel: (o) => BdApi.React.createElement("div", { className: cl("format-label") }, o.label),
                        renderOptionValue: () => rendered
                    }
                ), BdApi.React.createElement(FormTitle, null, ""), data
            ),
            BdApi.React.createElement(
                ModalFooter, null,
                BdApi.React.createElement(
                    Button,
                    {
                        disabled: ((formaObj.value == "---" || formaObj.value == null || formaObj.value.length <= 0) ? true : false),
                        onClick: () => {
                            const ComponentDispatch = BdApi.Webpack.getModule((m) => m.emitter?._events?.INSERT_TEXT, { searchExports: true });
                            ComponentDispatch.dispatchToLastSubscribed("INSERT_TEXT", { rawText: getFormatsForm(formData, formaObj.value), plainText: getFormatsForm(formData, formaObj.value) });
                
                            rootProps.onClose();
                        }
                    },
                    "Вставить"
                )
            )
        );
    } catch(e) {
        console.error(e);
    }
}


/*
    [ HELPER'S ]
*/
function getFormatsForm(formData, data) {
    if(data) {
        Object.keys(formData).forEach(key => (data.includes(`{{${key}}}`)) ? data = data.replace(new RegExp(`{{${key}}}`, 'g'), formData[key]) : null);
    
        return data;
    } else return "Похоже, произошла ошибка..\n\nОбратитесь к поддержке!";
}



/*
    [ UPDATE SYSTEM ]
*/
function API_checkUpdate(autoCheckForStartUp = true) {
    try {
        request.get(`${mainConfig['api']['url']}${mainConfig['api']['config']}`, (error, response, body) => {
            if(error) return BdApi.showToast(error, { type: "error" });
            if(response.statusCode == 200) {
                const apiData = JSON.parse(body.toString());
                const pluginData = apiData['AdminRankForms'];

                var tempApiVersion = '0.0';
                var tempApiChanges = '---';
                var tempApiBuild = 'stable';
                var tempApiRequired = false;
                var tempApiDisabled = false;


                if(!pluginData || pluginData.length <= 0) return (autoCheckForStartUp) ? BdApi.showToast(`Нет новых обновлений.`, { type: "info" }) : false;
                else {
                    for(let i = 0; i < pluginData.length; i++) {
                        if(pluginData[i].version > mainConfig['version']) {
                            tempApiVersion = pluginData[i].version;
                            tempApiChanges = pluginData[i].changes;
                            tempApiBuild = pluginData[i].build;
                            tempApiRequired = pluginData[i].required;
                            tempApiDisabled = pluginData[i].disabled;

                            break;
                        }
                    }

                    if(tempApiVersion == "0.0" || tempApiVersion == mainConfig['version'] || tempApiDisabled) return (autoCheckForStartUp) ? BdApi.showToast(`Нет новых обновлений.`, { type: "info" }) : false;
                }

                if(tempApiRequired) {
                    try {
                        request.get(`${mainConfig['api']['url']}${mainConfig['api']['versions']}${tempApiVersion}/SelectFormForAdminRank.plugin.js`, (error, response, body) => {
                            if(error) return BdApi.showToast(error, { type: "error" });
                            if(response.statusCode == 200) {
                                fs.writeFileSync(path.join(BdApi.Plugins.folder, "SelectFormForAdminRank.plugin.js"), body);
                                return BdApi.showToast(`Обновление v${tempApiVersion} загружено.`, { type: "success" });
                            } else return BdApi.showToast(`Версия ${tempApiVersion} не найдена на API сервере!`, { type: "error" });
                        });
                    } catch (error) {
                        return BdApi.showToast(`Ошибка при установке обновления!`, { type: "error" });
                    }
                } else {
                    switch(tempApiBuild) {
                        case 'stable':
                        {
                            BdApi.showConfirmationModal(
                                `${mainConfig['name']} | Новое обновление!`, `Ваша версия: \`${mainConfig['version']}\` | Новая версия: \`${tempApiVersion}\` | Билд: \`${tempApiBuild}\`\n\n\`\`\`yml\n${tempApiChanges}\`\`\`\n\n> Подать баг: https://discord.gg/ZaNnGGNDWb`,
                                {
                                    confirmText: "Установить",
                                    cancelText: "Отменить",
                                    onConfirm: () => {
                                        try {
                                            request.get(`${mainConfig['api']['url']}${mainConfig['api']['versions']}${tempApiVersion}/SelectFormForAdminRank.plugin.js`, (error, response, body) => {
                                                if(error) return BdApi.showToast(error, { type: "error" });
                                                if(response.statusCode == 200) {
                                                    fs.writeFileSync(path.join(BdApi.Plugins.folder, "SelectFormForAdminRank.plugin.js"), body);
                                                    return BdApi.showToast(`Обновление v${tempApiVersion} загружено.`, { type: "success" });
                                                } else return BdApi.showToast(`Версия ${tempApiVersion} не найдена на API сервере!`, { type: "error" });
                                            });
                                        } catch (error) {
                                            return BdApi.showToast(`Ошибка при установке обновления!`, { type: "error" });
                                        }
                                    },
                                }
                            );
                            break;
                        }
    
                        case 'dev':
                        {
                            BdApi.showConfirmationModal(
                                `${mainConfig['name']} | Новое обновление!`, `Ваша версия: \`${mainConfig['version']}\` | Новая версия: \`${tempApiVersion}\` | Билд: \`${tempApiBuild}\`\n\n> ## Обратите внимание: Версия ${tempApiVersion} находится в разработке (dev build), поэтому возможны ошибки.\n\n\`\`\`yml\n${tempApiChanges}\`\`\`\n\n> Подать баг: https://discord.gg/ZaNnGGNDWb`,
                                {
                                    confirmText: "Установить",
                                    cancelText: "Отменить",
                                    onConfirm: () => {
                                        try {
                                            request.get(`${mainConfig['api']['url']}${mainConfig['api']['versions']}${tempApiVersion}/SelectFormForAdminRank.plugin.js`, (error, response, body) => {
                                                if(error) return BdApi.showToast(error, { type: "error" });
                                                if(response.statusCode == 200) {
                                                    fs.writeFileSync(path.join(BdApi.Plugins.folder, "SelectFormForAdminRank.plugin.js"), body);
                                                    return BdApi.showToast(`Обновление загружено.`, { type: "success" });
                                                } else return BdApi.showToast(`Версия ${tempApiVersion} не найдена на API сервере!`, { type: "error" });
                                            });
                                        } catch (error) {
                                            return BdApi.showToast(`Ошибка при установке обновления!`, { type: "error" });
                                        }
                                    },
                                }
                            );
                            break;
                        }

                        default: return;
                    }
                }
            } else return BdApi.showToast(`Ошибка подключения к API серверу!`, { type: "error" });
        });
    } catch (error) {
        return BdApi.showToast(`Неизвестная ошибка при работе с обновлениям..\n\nОбратитесь к поддержке!`, { type: "error" });
    }
}


/*
    [ LOAD STANDART FORMS ]
*/
function API_loadforms() {
    try {
        request.get(`${mainConfig['api']['url']}${mainConfig['api']['data']}`, (error, response, body) => {
            if(error) return BdApi.showToast(error, { type: "error" });
            if(response.statusCode == 200) {
                var data = {
                    "SelectFormForAdminRank": {
                        "forms": [
                            {
                                "name": "======!> { Админ Действия } <!======",
                                "value": "---",
                                "disabled": true
                            },
                            {
                                "name": "Откат дейcтвия",
                                "value": "> UPD: Откат действия\n> * Причина: `{{reason}}`",
                                "disabled": false
                            },
                            {
                                "name": "Принят на Модератора",
                                "value": "> Игрок @ принят на пост модератора\n\n> * Данные:\n>  * Ник: `{{nick}}`\n>  * SteamID: `{{steamid}}`\n>  * Смена: `Дневная/Ночная`\n>  * Соц. Рейтинг: `25`\n>  * Часов: `0`\n>  * Дата рождения: `01.01.0001`\n\n> * Требуется: \n>  * Провести проверить на проф. пригодность: @\n>  * Провести проверку КГБ: @\n>  * Провести обучения: @",
                                "disabled": false
                            },
                            {
                                "name": "Прошёл проверку НКВД",
                                "value": "> {{dolj}} @ прошёл проверку НКВД",
                                "disabled": false
                            },
                            {
                                "name": "НЕ Прошёл проверку НКВД",
                                "value": "> {{dolj}} @ не прошёл проверку НКВД\n> * Причина: `{{reason}}`\n> * Чёрный-Список: `Навсегда`",
                                "disabled": false
                            },
                            {
                                "name": "Прошёл обучение",
                                "value": "> {{dolj}} @ прошёл обучение\n> * Испытательный срок: `{{trial}} дн.`\n\n> * Требуется:\n>  * Выдать роли\n>  * Выдать ранг (`{{steamid}}` | `{{rank}}`)\n> <@&890637093003481138><@&890607376074412082>",
                                "disabled": false
                            },
                            {
                                "name": "Принят в отдел (ЛС-ВС)",
                                "value": "> {{dolj}} @ принят в отдел `{{depart}}`\n> * Причина: `{{reason}}`\n> * Испытательный срок: `{{trial}} дн.`\n\n> * Требуется:\n>  * Выдать роли\n>  * Выдать ранг (`{{steamid}}` | `{{rank}}`)\n> <@&890637093003481138><@&890607376074412082>",
                                "disabled": false
                            },
                            {
                                "name": "Повышен в ранге",
                                "value": "> {{dolj}} @ повышен до `{{rank}}`\n> * Требуется:\n>  * Выдать ранг `{{steamid}}`\n> <@&890637093003481138><@&890607376074412082>",
                                "disabled": false
                            },
                            {
                                "name": "Снятие с поста",
                                "value": "> {{dolj}} @ покидает наш состав\n> * Причина: `{{reason}}`\n> * Чёрный-Список: ` `\n\n> * Статистика:\n>  * Наказания: `0/0`\n>  * Соц. рейтинг: `0`\n\n> * Требуется:\n>  * Выдать роли\n>  * Выдать ранг (`{{steamid}}` | `{{rank}}`)\n> <@&890637093003481138><@&890607376074412082>",
                                "disabled": false
                            },
                            {
                                "name": "Перевод в отдел Дневной/Ночной",
                                "value": "> {{dolj}} @ переводится в отдел (дневной/ночной) администрации\n> * Требуется занести в таблицу: Пинг сотрудников дневной и ночной администрации.",
                                "disabled": false
                            },
                            {
                                "name": "Выдать устное(ые) предупреждение(я)",
                                "value": "> {{dolj}} @ получает **{{number}} устное(ые) предупреждение(я)**\n> * Причина: `{{reason}}`",
                                "disabled": false
                            },
                            {
                                "name": "Выдать предупреждение(я)",
                                "value": "> {{dolj}} @ получает **{{number}} предупреждение(я)**\n> * Причина: `{{reason}}`",
                                "disabled": false
                            },
                            {
                                "name": "Снять предупреждение(я)",
                                "value": "> {{dolj}} @ снимает **{{number}} предупреждение(я)**\n> * Причина: `{{reason}}`",
                                "disabled": false
                            },
                            {
                                "name": "Выдать выговор(ы)",
                                "value": "> {{dolj}} @ получает **{{number}} выговор(ы)**\n> * Причина: `{{reason}}`",
                                "disabled": false
                            },
                            {
                                "name": "Снять выговор(ы)",
                                "value": "> {{dolj}} @ снимает **{{number}} выговор(ы)**\n> * Причина: `{{reason}}`",
                                "disabled": false
                            },
                            {
                                "name": "Выдать отпуск",
                                "value": "> {{dolj}} @ получает отпуск с: **{{s_date}}** по: **{{e_date}}**\n> * Причина: `{{reason}}`",
                                "disabled": false
                            },
                            {
                                "name": "Снять отпуск",
                                "value": "> {{dolj}} @ выходит с отпуска\n> * Причина: `{{reason}}`\n\n> * Требуется:\n>  * Занести в таблицу: Пинг сотрудников дневной/ночной администрации",
                                "disabled": false
                            },
                            {
                                "name": "Выдать метку",
                                "value": "> {{dolj}} @ получает **{{mark}}** метку\n> * Причина: `{{reason}}`",
                                "disabled": false
                            },
                            {
                                "name": "Выдать рекомендацию",
                                "value": "> {{dolj}} @ получает рекомендацию\n> * Причина: `{{reason}}`",
                                "disabled": false
                            },
                            {
                                "name": "Сгорает рекомендация",
                                "value": "> {{dolj}} @ лишается/сгорает рекомендации(-я)\n> * Причина: `{{reason}}`",
                                "disabled": false
                            },
                            {
                                "name": "Выдать соц. рейтинг",
                                "value": "> @ +{{number}} рейтинга\n> * Причина: `{{reason}}`",
                                "disabled": false
                            },
                            {
                                "name": "Снять соц. рейтинг",
                                "value": "> @ -{{number}} рейтинга\n> * Причина: `{{reason}}`",
                                "disabled": false
                            },
                            {
                                "name": "Выдать строгую неделю",
                                "value": "> {{dolj}} @ получает строгую неделю с: **{{s_date}}** до: **{{e_date}}**\n> * Причина: `{{reason}}`",
                                "disabled": false
                            },
                            {
                                "name": "Снять строгую неделю",
                                "value": "> {{dolj}} @ снимает строгую неделю\n> * Причина: `{{reason}}`",
                                "disabled": false
                            },
                            {
                                "name": "======!> { Дополнительные } <!======",
                                "value": "---",
                                "disabled": true
                            },
                            {
                                "name": "Выдача банов",
                                "value": "1. {{server}}\n2. {{nick}}\n3. {{nick_trigger}} / {{steamid}}\n4. {{term}}\n5. {{reason}}\n6. <t:{{timestamp}}:D>",
                                "disabled": false
                            },
                            {
                                "name": "======!> { Кастомные } <!======",
                                "value": "---",
                                "disabled": true
                            }
                        ],
                
                        "servers": [
                            {
                                "name": "Мухосранск RP",
                                "data": {
                                    "role_ids": {
                                        "Менеджер": "",
                                        "Заместитель Менеджера": "",
                                        "Высший-Состав": "",
                                        "Личный-Состав": "",
                                        "Кандидат на ЛС": "",
                                        "Администратор Повышенной Категории": "",
                                        "Администратор": "",
                                        "Модератор": "",
                                        "Герой Партии": ""
                                    }
                                },
                                "disabled": true
                            },
                            {
                                "name": "SCP RP",
                                "data": {
                                    "role_ids": {
                                        "Менеджер": "",
                                        "Заместитель Менеджера": "",
                                        "Высший-Состав": "",
                                        "Личный-Состав": "",
                                        "Кандидат на ЛС": "",
                                        "Администратор Повышенной Категории": "",
                                        "Администратор": "",
                                        "Модератор": "",
                                        "Герой Партии": ""
                                    }
                                },
                                "disabled": true
                            },
                            {
                                "name": "WW2 RP",
                                "data": {
                                    "role_ids": {
                                        "Менеджер": "",
                                        "Заместитель Менеджера": "",
                                        "Высший-Состав": "",
                                        "Личный-Состав": "",
                                        "Кандидат на ЛС": "",
                                        "Администратор Повышенной Категории": "",
                                        "Администратор": "",
                                        "Модератор": "",
                                        "Герой Партии": ""
                                    }
                                },
                                "disabled": true
                            },
                            {
                                "name": "LOUISIANA RP",
                                "data": {
                                    "role_ids": {
                                        "Менеджер": "",
                                        "Заместитель Менеджера": "",
                                        "Высший-Состав": "",
                                        "Личный-Состав": "",
                                        "Кандидат на ЛС": "",
                                        "Администратор Повышенной Категории": "",
                                        "Администратор": "",
                                        "Модератор": "",
                                        "Герой Партии": ""
                                    }
                                },
                                "disabled": true
                            }
                        ],
                
                        "doljs": [
                            {
                                "name": "Игрок",
                                "disabled": false
                            },
                            {
                                "name": "Модератор",
                                "disabled": false
                            },
                            {
                                "name": "Администратор",
                                "disabled": false
                            },
                            {
                                "name": "Администратор Повышенной Категории",
                                "disabled": false
                            },
                            {
                                "name": "Кандидат на ЛС",
                                "disabled": false
                            },
                            {
                                "name": "Личный-Состав",
                                "disabled": false
                            },
                            {
                                "name": "Высший-Состав",
                                "disabled": false
                            },
                            {
                                "name": "Заместитель Менеджера",
                                "disabled": false
                            },
                            {
                                "name": "Менеджер",
                                "disabled": false
                            }
                        ],
                
                        "ranks": [
                            {
                                "name": "user",
                                "disabled": false
                            },
                            {
                                "name": "vip",
                                "disabled": false
                            },
                            {
                                "name": "moderator",
                                "disabled": false
                            },
                            {
                                "name": "administrator",
                                "disabled": false
                            },
                            {
                                "name": "headadmin",
                                "disabled": false
                            },
                            {
                                "name": "supadmin",
                                "disabled": false
                            },
                            {
                                "name": "globaladmin",
                                "disabled": false
                            },
                            {
                                "name": "root",
                                "disabled": false
                            },
                            {
                                "name": "superadmin",
                                "disabled": false
                            }
                        ],
                
                        "marks": [
                            {
                                "name": "+50",
                                "disabled": false
                            },
                            {
                                "name": "+100",
                                "disabled": false
                            },
                            {
                                "name": "+150",
                                "disabled": false
                            },
                            {
                                "name": "+200",
                                "disabled": false
                            },
                            {
                                "name": "+250",
                                "disabled": false
                            },
                            {
                                "name": "+300",
                                "disabled": false
                            },
                            {
                                "name": "+350",
                                "disabled": false
                            },
                            {
                                "name": "+400",
                                "disabled": false
                            },
                            {
                                "name": "+450",
                                "disabled": false
                            },
                            {
                                "name": "+500",
                                "disabled": false
                            },
                            {
                                "name": "+1000",
                                "disabled": false
                            }
                        ],
                
                        "departments": [
                            {
                                "name": "Дисциплины",
                                "disabled": false
                            },
                            {
                                "name": "Набора",
                                "disabled": false
                            },
                            {
                                "name": "Документации",
                                "disabled": false
                            },
                            {
                                "name": "Проф. пригодности",
                                "disabled": false
                            },
                            {
                                "name": "Обучения",
                                "disabled": false
                            },
                            {
                                "name": "СМИ",
                                "disabled": false
                            },
                            {
                                "name": "Дневной Администрации",
                                "disabled": false
                            },
                            {
                                "name": "Ночной Администрации",
                                "disabled": false
                            },
                            {
                                "name": "Выдачи банов",
                                "disabled": false
                            }
                        ],
                
                        "partias": [
                            {
                                "name": "КГБ",
                                "disabled": false
                            },
                            {
                                "name": "Кадров",
                                "disabled": false
                            },
                            {
                                "name": "Бухгалтерии",
                                "disabled": false
                            },
                            {
                                "name": "НКВД",
                                "disabled": false
                            },
                            {
                                "name": "Идеологии",
                                "disabled": false
                            },
                            {
                                "name": "Технологии / НЕДОСТУПНО",
                                "disabled": true
                            },
                            {
                                "name": "СМИ",
                                "disabled": false
                            },
                            {
                                "name": "Нормировочного",
                                "disabled": false
                            },
                            {
                                "name": "ОНД",
                                "disabled": false
                            },
                            {
                                "name": "М.КГБ",
                                "disabled": false
                            }
                        ]
                    }                
                };

                // const data = JSON.parse(body.toString())['SelectFormForAdminRank'];
                data = data['SelectFormForAdminRank'];
                const keys = ['forms', 'servers', 'doljs', 'ranks', 'marks', 'departments', 'partia'];

                keys.forEach((key) => {
                    const dataArray = data[key] || [];

                    if(key === 'forms') dataArray.forEach((item) => mainData['Formats'].push({ "name": item.name, "value": item.value, "disabled": item.disabled }));
                    else if(key === 'partia') dataArray.forEach((item) => mainData['Partia'].push({ "name": item.name, "value": item.name, "disabled": item.disabled }));
                    else dataArray.forEach((item) => mainData[key.charAt(0).toUpperCase() + key.slice(1)].push({ "name": item.name, "disabled": item.disabled }));
                });

                return BdApi.showToast("Формы успешно загружены!", { type: "success" });
            } else return BdApi.showToast(`Ошибка подключения к API серверу!`, { type: "error" });
        });
    } catch (error) {
        return BdApi.showToast(`Неизвестная ошибка при работе с загрузкой форм..\n\nОбратитесь к поддержке!`, { type: "error" });
    }
}



/*
    [ ADD ICON IN CHAT ]
*/
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
            onClick: () => openModal((props) => BdApi.React.createElement(ShowFormModal, { rootProps: props })),
            className: cl("button")
        },
        BdApi.React.createElement("div", { className: ButtonWrapperClasses.buttonWrapper }, BdApi.React.createElement("svg", { "aria-hidden": "true", role: "img", width: "24", height: "24", viewBox: "0 0 24 24" }, BdApi.React.createElement("g", { fill: "none", "fill-rule": "evenodd" }, BdApi.React.createElement("path", { fill: "orange", d: "M15 2a3 3 0 0 1 3 3v12H5.5a1.5 1.5 0 0 0 0 3h14a.5.5 0 0 0 .5-.5V5h1a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H5a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3h10Zm-.3 5.7a1 1 0 0 0-1.4-1.4L9 10.58l-2.3-2.3a1 1 0 0 0-1.4 1.42l3 3a1 1 0 0 0 1.4 0l5-5Z" }), BdApi.React.createElement("rect", { width: "24", height: "24" }))))
    )));
}
  
function findInReactTree(root, filter) {
    return BdApi.Utils.findInTree(root, filter, { walkable: ["children", "props"] });
}


/*
    [ PLUGIN CORE ]
*/
module.exports = meta => {
    mainConfig['api']['url'] = meta.api;
    mainConfig['version'] = meta.version;
    mainConfig['build'] = meta.build;
    mainConfig['name'] = meta.name;


    return {
        load: () => {
            API_checkUpdate(false);
            API_loadforms(false);
        },
        start: () => {
            var Chat = BdApi.Webpack.getModule((m) => m?.type?.render?.toString().includes("chat input type must be set"));
            
            if(typeof Chat === 'object' && Chat !== null && typeof Chat.type === 'object' && Chat.compare === null) {
                BdApi.DOM.addStyle("vbd-st", `.vbd-its-modal-content input{background-color:var(--input-background);color:var(--text-normal);width:95%;padding:8px 8px 8px 12px;margin:1em 0;outline:none;border:1px solid var(--input-background);border-radius:4px;font-weight:500;font-style:inherit;font-size:100%;}.vbd-its-format-label,.vbd-its-format-label span{background-color:transparent;}.vbd-its-modal-content [class|="select"]{margin-bottom:1em;}.vbd-its-modal-content [class|="select"] span{background-color:var(--input-background);}.vbd-its-modal-header{justify-content:space-between;align-content:center;}.vbd-its-modal-header h1{margin:0;}.vbd-its-modal-header button{padding:0;}.vbd-its-preview-text{margin-bottom:1em;}.vbd-its-button{padding:0 6px;}.vbd-its-button svg{transform:scale(1.1) translateY(1px);}`);
                BdApi.Patcher.after("vbd-st", Chat.type, "render", (_this, _args, res) => {
                    const chatBar = findInReactTree(res, (n) => Array.isArray(n?.children) && n.children.some((c) => c?.props?.className?.startsWith("attachButton")))?.children;
                    if(!chatBar) return;

                    const buttons = findInReactTree(chatBar, (n) => n?.props?.showCharacterCount);
                    if(buttons?.props.disabled) return;
                    else chatBar.splice(-1, 0, BdApi.React.createElement(ChatBarComponent, null));
                });
            }
        },
        stop: () => {
            BdApi.DOM.removeStyle("vbd-st");
            BdApi.Patcher.unpatchAll("vbd-st");
        }
    }
};