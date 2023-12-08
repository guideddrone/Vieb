/*
* Vieb - Vim Inspired Electron Browser
* Copyright (C) 2019-2023 Jelmer van Arnhem
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
"use strict"

const {appConfig, compareVersions} = require("../util")
const {translate} = require("../translate")

const apiUrl = "https://api.github.com/repos/Jelmerro/Vieb/releases/latest"
const {name, icon, version} = appConfig() ?? {}

/** Check for updates to Vieb on button click via Github. */
const checkForUpdates = () => {
    const versionCheck = document.getElementById("version-check")
    const button = document.querySelector("button")
    if (!versionCheck || !button || !version) {
        return
    }
    versionCheck.textContent = translate("pages.version.loading")
    button.disabled = true
    const req = new XMLHttpRequest()
    /** Compare the current version to the latest Github version and report. */
    req.onreadystatechange = () => {
        if (req.readyState === 4) {
            if (req.status === 200) {
                try {
                    const release = JSON.parse(req.responseText)
                    const diff = compareVersions(version, release.tag_name)
                    if (diff === "older") {
                        versionCheck.textContent = translate(
                            "pages.version.newerFound", [release.tag_name])
                    } else if (diff === "newer") {
                        versionCheck.textContent = translate(
                            "pages.version.alreadyNewer", [release.tag_name])
                    } else if (diff === "even") {
                        versionCheck.textContent = translate(
                            "pages.version.latest")
                    } else {
                        versionCheck.textContent = translate(
                            "pages.version.failed")
                    }
                } catch {
                    versionCheck.textContent = translate("pages.version.failed")
                }
            } else {
                versionCheck.textContent = translate("pages.version.failed")
            }
            button.disabled = false
        }
    }
    req.open("GET", apiUrl, true)
    req.send(null)
}

window.addEventListener("DOMContentLoaded", () => {
    // Translations
    const subtitleEl = document.getElementById("subtitle")
    if (subtitleEl) {
        subtitleEl.textContent = translate("util.catchphrase")
    }
    const buttonEl = document.querySelector("button")
    if (buttonEl) {
        buttonEl.textContent = translate("pages.version.checkUpdate")
    }
    const checkResultEl = document.getElementById("version-check")
    if (checkResultEl) {
        checkResultEl.textContent = translate("pages.version.notChecked")
    }
    const versionLinks = document.getElementById("version-links")
    if (versionLinks) {
        for (const el of versionLinks.children) {
            el.textContent = translate(`pages.version.${
                el.textContent?.trim() ?? ""}`)
        }
    }
    const descriptionEl = document.getElementById("description")
    if (descriptionEl) {
        descriptionEl.innerHTML = translate("pages.version.description",
            [process.versions.electron, process.versions.chrome])
    }
    // Regular init
    const nameEl = document.getElementById("name")
    if (nameEl) {
        nameEl.textContent = name ?? "Vieb"
    }
    const imgEl = document.querySelector("img")
    if (imgEl && icon) {
        imgEl.src = icon
    }
    const versionEl = document.getElementById("version")
    if (versionEl) {
        versionEl.textContent = version ?? ""
    }
    if (buttonEl) {
        buttonEl.addEventListener("click", checkForUpdates)
    }
})
