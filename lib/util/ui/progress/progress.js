/**
 *
 * @licstart
 *
 * Web Cura
 * Copyright (C) 2020 SynDaver Labs, Inc.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 * @licend
 *
 */

class ProgressBar {
    static show() {
        if(!$("#progress-dialog progress").is(":visible")) {
            $("#progress-dialog progress").attr("value",0);
            $("#progress-dialog").show();
        }
    }

    static progress(value) {
        $("#progress-dialog progress").attr("value",value);
        this.show();
    }
    
    static message(message) {
        $("#progress-dialog label").html(message);
        this.show();
    }

    static hide() {
        $("#progress-dialog").hide();
    }
}