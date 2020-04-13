/**
 * WebSlicer
 * Copyright (C) 2016 Marcio Teixeira
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */

var settings, gcode_blob;

class SettingsPanel {
    static init(id) {
        var s = new SettingsUI(id);

        /**
         * Helper function for obtaining UI parameters from the slicer engine
         */
        var valueSetter = {};

        s.fromSlicer = function(key) {
            var sd = slicer.getOptionDescriptor(key);
            var label = sd.hasOwnProperty("label") ? sd.label : key;
            var el;
            var attr = {
                units:   sd.unit,
                tooltip: sd.description,
                id:      key
            };
            switch(sd.type) {
                case 'float':
                case 'int':
                    attr.step = (sd.type == 'int') ? 1 : 0.01;
                    el = s.number(label, attr);
                    valueSetter[key] = (key, val) => {el.value = val;}
                    el.addEventListener('change', (event) => slicer.setOption(key, parseFloat(event.target.value)));
                    break;
                case 'str':
                    el = s.textarea(label, attr);
                    valueSetter[key] = (key, val) => {el.value = val;}
                    el.addEventListener('change', (event) => slicer.setOption(key, event.target.value));
                    break;
                case 'bool':
                    el = s.toggle(label, attr);
                    valueSetter[key] = (key, val) => {el.checked = val;}
                    el.addEventListener('change', (event) => slicer.setOption(key,el.checked));
                    break;
                case 'enum':
                    var o = s.choice(label, attr);
                    for(const [value, label] of Object.entries(sd.options)) {
                        o.option(label, {id: value});
                    }
                    valueSetter[key] = (key, val) => {o.element.value = val;}
                    o.element.addEventListener('change', (event) => slicer.setOption(key, event.target.value));
                    break;
            }
        }

        slicer.onOptionChanged =    (name, val)  => {if(valueSetter.hasOwnProperty(name)) valueSetter[name](name, val);};
        slicer.onAttributeChanged = (name, attr) => {s.setVisibility(name, attr.enabled);};

        s.page("Place Objects",                                      {id: "page_place"});

        s.file("Drop model file here<br><small>(STL, OBJ or 3MF)</small>",
                                                                     {id: "model_select", onchange: SettingsPanel.onFileChange, binary: true});

        s.separator(                                                 {type: "br"});
        s.button(     "Add Object",                                  {id: "add_to_platform", onclick: SettingsPanel.onAddToPlatform});
        s.button(     "Clear Objects",                               {id: "clear_platform", onclick: SettingsPanel.onClearPlatform});
        s.separator();
        s.button(     "Next",                                        {id: "done_placing", onclick: SettingsPanel.onGotoSliceClicked});
        s.buttonHelp( "Click this button to when<br>you are done placing objects.");

        s.page(       "Transform Objects",                           {id: "page_transform"});

        s.category(   "Position",                                    {id: "xform_position"});
        s.number(         "X",                                       {id: "xform_position_x", units: "mm", onchange: SettingsPanel.onEditPosition});
        s.number(         "Y",                                       {id: "xform_position_y", units: "mm", onchange: SettingsPanel.onEditPosition});
        s.number(         "Z",                                       {id: "xform_position_z", units: "mm", onchange: SettingsPanel.onEditPosition});

        s.category(   "Scale",                                       {id: "xform_scale"});
        s.number(         "X",                                       {id: "xform_scale_x_pct", units: "%", onchange: SettingsPanel.onEditScalePct});
        s.number(         "Y",                                       {id: "xform_scale_y_pct", units: "%", onchange: SettingsPanel.onEditScalePct});
        s.number(         "Z",                                       {id: "xform_scale_z_pct", units: "%", onchange: SettingsPanel.onEditScalePct});
        s.separator(                                                 {type: "br"});
        s.number(         "X",                                       {id: "xform_scale_x_abs", units: "mm"});
        s.number(         "Y",                                       {id: "xform_scale_y_abs", units: "mm"});
        s.number(         "Z",                                       {id: "xform_scale_z_abs", units: "mm"});
        s.separator(                                                 {type: "br"});
        s.toggle(     "Uniform Scaling",                             {id: "xform_scale_uniform"});

        s.category(   "Rotation",                                    {id: "xform_rotate"});
        s.number(         "X",                                       {id: "xform_rotation_x", units: "°", onchange: SettingsPanel.onEditRotation});
        s.number(         "Y",                                       {id: "xform_rotation_y", units: "°", onchange: SettingsPanel.onEditRotation});
        s.number(         "Z",                                       {id: "xform_rotation_z", units: "°", onchange: SettingsPanel.onEditRotation});

        s.page(       "Manage Presets",                              {id: "page_profiles"});

        s.category(   "Printer &amp; Material",                      {open: "open"});
        s.choice(     "Printer:",                                    {id: "preset_select"})
         .option(         "Lulzbot TAZ Workhorse Aero 0.5 mm",       {id: "lulzbot_taz_we_aero_0.5mm"})
         .option(         "Lulzbot Mini 2 Aero 0.5 mm",              {id: "lulzbot_mini2_aero_0.5mm"});

        s.choice(     "Material:",                                   {id: "material_select"})
         .option(         "Polymaker Polylite PLA",                  {id: "polymaker_polylite_pla"});
        s.separator(                                                 {type: "br"});
        s.button(     "Apply",                                       {onclick: SettingsPanel.onApplyPreset});
        s.buttonHelp( "Applying presets resets all printer &amp; material settings<br>to defaults, including modified or imported settings.");

        s.page(       "Machine Settings",                            {id: "page_machine"});

        s.category(   "Hot End");
        s.fromSlicer(     "machine_nozzle_size");

        s.category(   "Auto Leveling");
        s.fromSlicer(     "machine_probe_type");

        s.category(   "Build Volume");
        s.fromSlicer(     "machine_shape");
        s.fromSlicer(     "machine_width");
        s.fromSlicer(     "machine_depth");
        s.fromSlicer(     "machine_height");
        s.fromSlicer(     "machine_center_is_zero");
        s.fromSlicer(     "machine_heated_bed");
        s.button(     "Save Changes",                                {onclick: SettingsPanel.onPrinterSizeChanged});

        s.category(   "Start/End Template");
        s.buttonHelp( "Template to edit:");
        s.button(         "Start",                                   {onclick: SettingsPanel.onEditStartGcode});
        s.button(         "End",                                     {onclick: SettingsPanel.onEditEndGcode});

        s.page(       "",                                            {id: "page_start_gcode"});
        s.fromSlicer(     "machine_start_gcode");
        s.button(         "Done",                                    {onclick: SettingsPanel.doneEditingGcode});

        s.page(       "",                                            {id: "page_end_gcode"});
        s.fromSlicer(     "machine_end_gcode");
        s.button(         "Done",                                    {onclick: SettingsPanel.doneEditingGcode});

        s.page(       "Slice Objects",                               {id: "page_slice"});

        s.category(   "Print Strength");
        s.fromSlicer(       "infill_pattern");
        s.fromSlicer(       "infill_sparse_density");
        s.fromSlicer(       "wall_line_count");

        s.category(   "Print Speed");
        s.fromSlicer(       "speed_print");
        s.fromSlicer(       "layer_height");

        s.category(   "Temperatures");
        s.fromSlicer(       "material_print_temperature");
        s.fromSlicer(       "material_bed_temperature");
        s.fromSlicer(       "material_part_removal_temperature");
        s.fromSlicer(       "material_probe_temperature");
        s.fromSlicer(       "material_soften_temperature");
        s.fromSlicer(       "material_wipe_temperature");

        s.category(   "Scaffolding");
        s.fromSlicer(       "support_enable");
        s.fromSlicer(       "support_type");
        s.fromSlicer(       "support_pattern");
        s.fromSlicer(       "support_infill_rate");
        s.fromSlicer(       "support_angle");
        s.fromSlicer(       "adhesion_type");

        s.category(   "Filament");
        s.fromSlicer(       "material_diameter");
        s.fromSlicer(       "material_flow");

        s.category(   "Special Modes");
        s.fromSlicer(       "magic_spiralize");
        s.fromSlicer(       "magic_fuzzy_skin_enabled");

        s.category();
        s.separator();
        s.button(     "Slice",                                       {onclick: SettingsPanel.onSliceClicked});
        s.buttonHelp( "Click this button to prepare<br>the model for printing.");

        s.page(       "Print and Preview",                           {id: "page_print"});

        s.category(   "Print Statistics",                            {open: "open"});
        s.text(           "Print time",                              {id: "print_time"});
        s.number(         "Filament used",                           {id: "print_filament", units: "mm²"});

        s.category(   "Preview Options",                             {open: "open"});
        s.toggle(         "Show shell",                              {id: "show_shell", onclick: SettingsPanel.onUpdatePreview, checked: 'checked'});
        s.toggle(         "Show infill",                             {id: "show_infill", onclick: SettingsPanel.onUpdatePreview});
        s.toggle(         "Show scaffolding",                        {id: "show_support", onclick: SettingsPanel.onUpdatePreview});
        s.toggle(         "Show travel",                             {id: "show_travel", onclick: SettingsPanel.onUpdatePreview});
        s.slider(         "Show layer",                              {id: "preview_layer", oninput: SettingsPanel.onUpdateLayer});

        s.category(   "Save Options",                                {open: "open"});
        s.text(           "Save as:",                                {id: "gcode_filename", value: "output.gcode"});
        s.category();
        s.separator();
        s.button(     "Save",                                        {onclick: SettingsPanel.onDownloadClicked});
        s.buttonHelp( "Click this button to save<br>gcode for your 3D printer.");

        s.page(       "Final Steps",                                 {id: "page_finished"});
        s.element(                                                   {id: "help-post-print"});

        s.page(       "Advanced Features",                           {id: "page_advanced"});

        s.category(   "Slicer Output");
        s.button(     "Show",                                        {onclick: SettingsPanel.onShowLogClicked});
        s.buttonHelp( "Click this button to show<br>slicing engine logs.");

        s.category(   "Export Settings");
        s.toggle(         "Show units and values as comments",       {id: "export_with_choices"});
        s.toggle(         "Show units descriptions as comments",     {id: "export_with_descriptions"});
        s.toggle(         "Show default values as comments",         {id: "export_with_defaults"});
        s.separator(                                                 {type: "br"});
        s.text(       "Save as:",                                    {id: "export_filename", value: "config.toml"});
        s.separator(                                                 {type: "br"});
        s.button(     "Export",                                      {onclick: SettingsPanel.onExportClicked});
        s.buttonHelp( "Click this button to save changed<br>settings to your computer.");

        s.category(   "Import Settings");
        s.file(           "Drop settings file here",                 {id: "import_select", onchange: SettingsPanel.onImportChange});
        s.separator(                                                 {type: "br"});
        s.button(     "Apply",                                       {id: "import_settings", onclick: SettingsPanel.onImportClicked});
        s.buttonHelp( "Importing settings from a file will override<br>all printer &amp; material presets.");

        s.page(       "Help",                                        {id: "page_help"});

        s.heading(    "View Controls:");
        s.element(                                                   {id: "help-viewport"});

        s.done();

        s.onPageExit = SettingsPanel.onPageExit;

        settings = s;

        SettingsPanel.onFileChange(); // Disable buttons
        SettingsPanel.onImportChange(); // Disable buttons
        settings.enable("done_placing", false);
        SettingsPanel.loadStartupProfile();
    }

    static loadStartupProfile() {
        // Always start with defaults.
        slicer.loadDefaults(true);

        if (typeof(Storage) !== "undefined") {
            // Install handler for saving profile
            window.onunload = function() {
                console.log("Saved setting to local storage");
                localStorage.setItem("startup_config", slicer.saveProfileStr());
            }

            var stored_config = localStorage.getItem("startup_config");
            if(stored_config) {
                console.log("Loaded settings from local storage");
                slicer.loadProfileStr(stored_config);
                SettingsPanel.onPrinterSizeChanged();
                return;
            }
        }

        // If no local profile is found, reload starting profile
        SettingsPanel.applyPresets();
    }

    static applyPresets() {
        slicer.loadDefaults();
        slicer.loadProfile("machine", settings.get("preset_select") + ".toml", SettingsPanel.onPrinterSizeChanged);
        slicer.loadProfile("print",   settings.get("material_select") + ".toml");
    }

    static onEditStartGcode() {
        settings.gotoPage("page_start_gcode");
    }

    static onEditEndGcode() {
        settings.gotoPage("page_end_gcode");
    }

    static onGotoSliceClicked() {
        settings.gotoPage("page_slice");
    }

    static onPrinterSizeChanged() {
        var circular         = settings.get("machine_shape") == "elliptic";
        var origin_at_center = settings.get("machine_center_is_zero");
        var x_width          = settings.get("machine_width");
        var y_depth          = settings.get("machine_depth");
        var z_height         = settings.get("machine_height");
        stage.setPrinterCharacteristics(circular, origin_at_center, x_width, y_depth, z_height);
    }

    static onApplyPreset(evt) {
        try {
            SettingsPanel.applyPresets();
            alert("The new presets have been applied.");
        } catch(e) {
            alert(["Error:", e.message, "Line:", e.line].join(" "));
        }
    }

    static onImportChange(file) {
        settings.enable("import_settings", file);
    }

    static onImportClicked() {
        try {
            var stored_config = settings.get("import_select");
            slicer.loadDefaults();
            slicer.loadProfileStr(stored_config);
            SettingsPanel.onPrinterSizeChanged();
            alert("The new settings have been applied.");
        } catch(e) {
            alert(["Error:", e.message, "Line:", e.line].join(" "));
        }
    }

    static onExportClicked() {
        var config = slicer.saveProfileStr({
            descriptions: settings.get("export_with_descriptions"),
            defaults:     settings.get("export_with_defaults"),
            choices:      settings.get("export_with_choices")
        });
        var blob = new Blob([config], {type: "text/plain;charset=utf-8"});
        var filename = settings.get("export_filename");
        saveAs(blob, filename);
    }

    static doneEditingGcode() {
        settings.gotoPage("page_machine");
    }

    static onFileChange(file) {
        settings.enable('add_to_platform', file);
    }

    static onAddToPlatform() {
        const filename = settings.get("model_select_filename");
        const fileData = settings.get("model_select");
        const extension = filename.split('.').pop().toLowerCase();

        var geometry;
        switch(extension) {
          case 'obj': addFromObj(fileData); break;
          case '3mf': addFrom3MF(fileData); break;
          default:
            // Assume STL
            geometry = GEOMETRY_READERS.readStl(fileData, GEOMETRY_READERS.THREEGeometryCreator);
            stage.addGeometry(geometry);
            break;
        }

        document.getElementById("gcode_filename").value = filename.replace(".stl", ".gcode");
        settings.enable("done_placing", true);
    }

    static addFromObj(data) {
      const ldr = new THREE.OBJLoader();
      const dec = new TextDecoder();
      const str = dec.decode(data);
      const obj = ldr.parse(str);
      obj.traverse( node => {
        if (node instanceof THREE.Mesh) {
          stage.addGeometry(new THREE.Geometry().fromBufferGeometry(node.geometry));
        }
      });
    }

    static addFrom3MF(data) {
      const ldr = new THREE.ThreeMFLoader();
      const obj = ldr.parse(data);
      obj.traverse( node => {
        if (node instanceof THREE.Mesh) {
          stage.addGeometry(new THREE.Geometry().fromBufferGeometry(node.geometry));
        }
      });
    }

    static onClearPlatform() {
        stage.removeObjects();
        settings.enable("done_placing", false);
    }

    static onObjectSelected() {
        SettingsPanel.onObjectTransforming("translate");
        SettingsPanel.onObjectTransforming("rotate");
        SettingsPanel.onObjectTransforming("scale");
        SettingsPanel.onTransformModeChanged(stage.tranformMode);
    }
    
    static onTransformModeChanged(mode) {
        settings.expand("xform_position", mode == "translate");
        settings.expand("xform_rotate",    mode == "rotate");
        settings.expand("xform_scale",     mode == "scale");
        settings.gotoPage("page_transform");        
    }

    static onObjectUnselected() {
        $('#xform_position_x').val("");
        $('#xform_position_y').val("");
        $('#xform_position_z').val("");
        $('#xform_rotation_x').val("");
        $('#xform_rotation_y').val("");
        $('#xform_rotation_z').val("");
        $('#xform_scale_x_pct').val("");
        $('#xform_scale_y_pct').val("");
        $('#xform_scale_z_pct').val("");
        settings.gotoPage("page_place");
    }

    static onEditPosition() {
        stage.selectedGroup.position.x = settings.get("xform_position_x");
        stage.selectedGroup.position.y = settings.get("xform_position_y");
        stage.selectedGroup.position.z = settings.get("xform_position_z");
        stage.onTransformationEdit(false);
    }

    static onEditScalePct() {
        stage.selectedGroup.scale.x = settings.get("xform_scale_x_pct") / 100;
        stage.selectedGroup.scale.y = settings.get("xform_scale_y_pct") / 100;
        stage.selectedGroup.scale.z = settings.get("xform_scale_z_pct") / 100;
        stage.onTransformationEdit();
    }

    static onEditRotation() {
        const toRad = deg => deg * Math.PI / 180;
        stage.selectedGroup.rotation.x = toRad(settings.get("xform_rotation_x"));
        stage.selectedGroup.rotation.y = toRad(settings.get("xform_rotation_y"));
        stage.selectedGroup.rotation.z = toRad(settings.get("xform_rotation_z"));
        stage.onTransformationEdit();
    }

    static onObjectTransforming(mode) {
        const toDeg = rad => (rad * 180 / Math.PI).toFixed(0);
        switch(mode) {
            case "translate":
                $('#xform_position_x').val(stage.selectedGroup.position.x.toFixed(2));
                $('#xform_position_y').val(stage.selectedGroup.position.y.toFixed(2));
                $('#xform_position_z').val(stage.selectedGroup.position.z.toFixed(2));
                break;
            case "rotate":
                $('#xform_rotation_x').val(toDeg(stage.selectedGroup.rotation.x));
                $('#xform_rotation_y').val(toDeg(stage.selectedGroup.rotation.y));
                $('#xform_rotation_z').val(toDeg(stage.selectedGroup.rotation.z));
                break;
            case "scale":
                $('#xform_scale_x_pct').val((stage.selectedGroup.scale.x * 100).toFixed(2));
                $('#xform_scale_y_pct').val((stage.selectedGroup.scale.y * 100).toFixed(2));
                $('#xform_scale_z_pct').val((stage.selectedGroup.scale.z * 100).toFixed(2));
                break;
        }
    }

    static onSliceClicked() {
        var geometries = stage.getAllGeometry();
        if(geometries.length) {
            var geometries = stage.getAllGeometry();
            var filenames  = geometries.map((geo,i) => {
                var filename = 'input_' + i + '.stl';
                slicer.loadFromGeometry(geo, filename);
                return filename;
            });
            showProgressBar();
            slicer.slice(filenames);
        }
    }

    static setPrintTime(value) {
        $("#print_time").attr("value",value);
    }

    static setPrintFilament(value) {
        $("#print_filament").attr("value",value);
    }

    static readyToDownload(data) {
        gcode_blob = new Blob([data], {type: "application/octet-stream"});
        hideProgressBar();
        settings.gotoPage("page_print");

        // Show the filament pathname
        var decoder = new TextDecoder();
        var path = new GCodeParser(decoder.decode(data));
        stage.setGcodePath(path);
        var max = stage.getGcodeLayers() - 1;
        $("#preview_layer").attr("max", max).val(max);
        SettingsPanel.onUpdatePreview();
    }

    static onDownloadClicked() {
        var fileName = settings.get("gcode_filename");
        saveAs(gcode_blob, fileName);
        settings.gotoPage("page_finished");
    }

    static onPageExit(page) {
        if(page == "page_print") {
            stage.setGcodePath(null);
        }
    }

    static onUpdatePreview() {
        stage.showGcodePath("TRAVEL",            settings.get("show_travel"));
        stage.showGcodePath("SKIN",              settings.get("show_shell"));
        stage.showGcodePath("DEFAULT",           settings.get("show_shell"));
        stage.showGcodePath("WALL-OUTER",        settings.get("show_shell"));
        stage.showGcodePath("WALL-INNER",        settings.get("show_shell"));
        stage.showGcodePath("FILL",              settings.get("show_infill"));
        stage.showGcodePath("SKIRT",             settings.get("show_support"));
        stage.showGcodePath("SUPPORT",           settings.get("show_support"));
        stage.showGcodePath("SUPPORT-INTERFACE", settings.get("show_support"));
        settings.enable("preview_layer", stage.isGcodePathVisible);
        $('#preview_layer').val(stage.getGcodeLayers() - 1);
    }

    static onUpdateLayer() {
        stage.setGcodeLayer(Math.trunc(settings.get("preview_layer")));
    }

    static onDoItAgainClicked() {
        settings.gotoPage("page_place");
    }
}