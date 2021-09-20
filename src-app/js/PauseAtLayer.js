/**
 * WebSlicer
 * Copyright (C) 2021  SynDaver 3D
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
 */

class PauseAtLayer {
    static init(s) {
        const attr = {name: "post_process_choice", onchange: PauseAtLayer.onChange};
        s.radio( "No post processing",                 {...attr, value: "none", checked: "checked"});

        s.radio( "Pause print at layer(s):",           {...attr, value: "pause-at-layer"});
        s.div({dataRadio: "post_process_choice", dataValue: "pause-at-layer"});
        s.text("\tLayer(s) to pause at:", {id: "pause_layer_list"});
        s.div();

        s.radio( "Run G-code every &#x1D465; layers:", {...attr, value: "gcode-every"});
        s.div({dataRadio: "post_process_choice", dataValue: "gcode-every"});
        s.textarea("\tInsert this G-code:", {id: "gcode-every-code", className: "stretch", value: "; Save a photo on the Level Up\nM118 P0 wifi_photo photos/${layer}.jpg"});
        s.text("\tEvery &#x1D465; layers:", {id: "gcode-every-layer", value:"10"});
        s.div();

        s.linkRadioToDivs('post_process_choice');
    }

    static postProcess(gcode) {
        return gcode;
    }
}