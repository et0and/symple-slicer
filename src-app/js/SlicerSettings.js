/**
 * WebSlicer
 * Copyright (C) 2021 SynDaver 3D
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

class SlicerSettings {
    static async populate(s) {
        const settings = localStorage.getItem("ui-slicer-settings") || query.slicer_settings || "syndaver-default";
        
        if (settings == "cura-all") return this.populateCuraSettings(s);
        if (!SlicerSettings.slicerSettings.hasOwnProperty(settings)) settings = "syndaver-default";

        for (const item of SlicerSettings.slicerSettings[settings]) {
            const indent = item.match(/^\s*/)[0].length;
            if(item.startsWith("#")) continue;
            if (item.endsWith(":")) {
                s.category(item.slice(0,-1));
            } else {
                s.fromSlicer(item.trim(),{},"\t".repeat(indent));
            }
        }
    }

    static async populateCuraSettings(s) {
        function parseChildren(child, label_prefix) {
            for (const [key, value] of Object.entries(child)) {
                s.fromSlicer(key,{},label_prefix);
                if (value.hasOwnProperty("children")) {
                    parseChildren(value.children, label_prefix + "\t");
                }
            }
        }
        const json = await fetchJSON("config/cura_defaults/fdmprinter.def.json");
        for (const [key, value] of Object.entries(json["settings"])) {
            if (key == "machine_settings" || key == "dual" || key == "command_line_settings") continue;
            if (value.type == "category") {
                s.category(value.label);
                parseChildren(value.children, "");
            }
        }
         
    }
}

SlicerSettings.slicerSettings = {
    /************************** SynDaver Beginners ***************************/
    "syndaver-beginner" : [
        // Settings list for beginners
        "Print Strength:",
            "infill_sparse_density",
            "infill_pattern",

        "Print Speed:",
            "layer_height",
            "speed_print",

        "Temperatures:",
            "material_print_temperature",
            "material_bed_temperature",
            " material_bed_temperature_layer_0",

        "Cooling:",
            "cool_fan_enabled",
            "cool_fan_speed",

        "Support &amp; Adhesion:",
            "support_enable",
            "adhesion_type",

        "Filament:",
            "material_diameter",
            "material_flow"
    ],

    /***************************** SynDaver Default ***************************/
    "syndaver-default" : [
        // Default settings list
        "Print Strength:",
            "infill_sparse_density",
            "infill_pattern",

        "Print Speed:",
            "layer_height",
            "layer_height_0",
            "speed_print",
            " speed_layer_0",
            " speed_support",
            "speed_travel",

        "Shell:",
            "wall_thickness",
            "top_layers",
            "bottom_layers",
            " initial_bottom_layers",
            "top_bottom_pattern",
            " top_bottom_pattern_0",
            "z_seam_type",
            " z_seam_position",
            "  z_seam_x",
            "  z_seam_y",
            "infill_before_walls",
            "ironing_enabled",

        "Retraction:",
            "retraction_enable",
            " retraction_amount",
            " retraction_speed",
            "retraction_combing",

        "Temperatures:",
            "material_print_temperature",
            " material_print_temperature_layer_0",
            "material_bed_temperature",
            " material_bed_temperature_layer_0",
            "material_probe_temperature",
            "material_soften_temperature",
            "material_wipe_temperature",
            "material_part_removal_temperature",
            "material_keep_part_removal_temperature",

        "Cooling:",
            "cool_fan_enabled",
            "cool_fan_speed_min",
            "cool_fan_speed_max",
            "cool_min_layer_time_fan_speed_max",
            "cool_min_layer_time",
            "cool_min_speed",

        "Support &amp; Adhesion:",
            "support_enable",
            " support_type",
            " support_pattern",
            " support_infill_rate",
            " support_angle",
            " support_z_distance",
            " support_xy_distance",
            " support_xy_distance_overhang",
            " support_interface_skip_height",
            " support_brim_enable",
            " support_interface_enable",
            "adhesion_type",
            " brim_width",
            " brim_gap",
            " raft_airgap",
            " raft_surface_layers",
            " skirt_line_count",

        "Filament:",
            "material_diameter",
            "material_flow",

        "Special Modes:",
            "print_sequence",
            "magic_spiralize",
            "magic_fuzzy_skin_enabled"
    ],

    /************************** SynDaver Ludracrous **************************/
   "syndaver-ludacrous" : [
        "Quality:",
            "layer_height",
            " layer_height_0",
            "line_width",
            "layer_0_z_overlap",
            "layer_start_x",
            "layer_start_y",

        "Walls:",
            "wall_line_count",
            " wall_thickness",
            "skin_outline_count",
            "skin_overlap",
            " skin_overlap_mm",
            "z_seam_position",
            "z_seam_corner",
            "z_seam_relative",
            "z_seam_type",
            "z_seam_x",
            "z_seam_y",
            "fill_outline_gaps",
            "fill_perimeter_gaps",
            "filter_out_tiny_gaps",
            "outer_inset_first",
            "optimize_wall_printing_order",
            "adaptive_layer_height_enabled",
            " adaptive_layer_height_threshold",
            " adaptive_layer_height_variation",
            " adaptive_layer_height_variation_step",
            "hole_xy_offset",
            "skin_angles",
            "skin_edge_support_layers",
            " skin_edge_support_thickness",
            "skin_line_width",
            "skin_material_flow",
            "skin_no_small_gaps_heuristic",
            "skin_preshrink",
            "wall_0_inset",
            "wall_0_material_flow",
            "wall_0_wipe_dist",
            "wall_line_width",
            " wall_line_width_0",
            " wall_line_width_x",
            "wall_material_flow",
            " wall_min_flow",
            " wall_min_flow_retract",
            "wall_overhang_angle",
            " wall_overhang_speed_factor",
            "wall_x_material_flow",
            "xy_offset",
            " xy_offset_layer_0",

        "Top/Bottom:",
            "top_layers",
            " top_thickness",
            "top_bottom_thickness",
            "top_skin_expand_distance",
            "top_skin_preshrink",
            "top_bottom_pattern",
            " top_bottom_pattern_0",
            "initial_bottom_layers",
            "bottom_layers",
            " bottom_thickness",
            "connect_skin_polygons",
            "ironing_enabled",
            " ironing_flow",
            " ironing_inset",
            " ironing_line_spacing",
            " ironing_only_highest_layer",
            " ironing_pattern",

        "Infill:",
            "infill_pattern",
            "infill_sparse_density",
            " infill_sparse_thickness",
            "infill_before_walls",
            "infill_support_enabled",
            " infill_support_angle",
            "connect_infill_polygons",
            "infill_overlap",
            " infill_overlap_mm",
            "infill_randomize_start_location",
            "infill_wall_line_count",
            "infill_wipe_dist",
            "infill_enable_travel_optimization",
            "infill_material_flow",
            "expand_skins_expand_distance",
            "gradual_infill_step_height",
            "gradual_infill_steps",
            "infill_angles",
            "infill_line_distance",
            "infill_line_width",
            "infill_mesh",
            " infill_mesh_order",
            "infill_multiplier",
            "infill_offset_x",
            "infill_offset_y",
            "min_infill_area",
            "min_skin_width_for_expansion",
            "zig_zaggify_infill",
            "sub_div_rad_add",

        "Material Temperatures:",
            "material_print_temperature",
            " default_material_print_temperature",
            " material_print_temperature_layer_0",
            " material_initial_print_temperature",
            " material_final_print_temperature",
            " material_soften_temperature",
            " material_standby_temperature",
            " material_wipe_temperature",
            " material_print_temp_prepend",
            " material_print_temp_wait",
            "material_bed_temperature",
            " default_material_bed_temperature",
            " material_bed_temperature_layer_0",
            " material_bed_temp_prepend",
            " material_bed_temp_wait",
            " material_part_removal_temperature",
            "build_volume_temperature",
            "material_diameter",
            "material_flow",
            " material_flow_dependent_temperature",
            " material_flow_layer_0",
            "material_adhesion_tendency",
            "material_anti_ooze_retracted_position",
            " material_anti_ooze_retraction_speed",
            "material_end_of_filament_purge_length",
            " material_end_of_filament_purge_speed",
            "material_extrusion_cool_down_speed",
            "material_flush_purge_length",
            " material_flush_purge_speed",
            "material_keep_part_removal_temperature",
            " material_keep_part_removal_temperature_t",
            "material_maximum_park_duration",
            "material_no_load_move_factor",
            "material_shrinkage_percentage",
            "material_surface_energy",

        "Speeds:",
            "speed_print",
            "  speed_layer_0",
            "  speed_print_layer_0",
            " speed_slowdown_layers",
            " speed_topbottom",
            " speed_infill",
            " speed_wall",
            "  speed_wall_0",
            "  speed_wall_x",
            " speed_travel",
            "  speed_travel_layer_0",
            " speed_z_hop",
            " speed_roofing",
            " speed_ironing",
            " speed_support",
            "  speed_support_bottom",
            "  speed_support_infill",
            "  speed_support_interface",
            "  speed_support_roof",
            " speed_prime_tower",
            " speed_equalize_flow_enabled",
            "  speed_equalize_flow_max",
            "acceleration_enabled",
            " acceleration_print",
            " acceleration_infill",
            " acceleration_ironing",
            " acceleration_layer_0",
            " acceleration_prime_tower",
            " acceleration_print_layer_0",
            " acceleration_roofing",
            " acceleration_skirt_brim",
            " acceleration_support",
            " acceleration_support_bottom",
            " acceleration_support_infill",
            " acceleration_support_interface",
            " acceleration_support_roof",
            " acceleration_topbottom",
            " acceleration_wall",
            " acceleration_wall_0",
            " acceleration_wall_x",
            " acceleration_travel",
            " acceleration_travel_layer_0",
            "jerk_enabled",
            " jerk_infill",
            " jerk_ironing",
            " jerk_layer_0",
            " jerk_prime_tower",
            " jerk_print",
            " jerk_print_layer_0",
            " jerk_roofing",
            " jerk_skirt_brim",
            " jerk_support",
            " jerk_support_bottom",
            " jerk_support_infill",
            " jerk_support_interface",
            " jerk_support_roof",
            " jerk_topbottom",
            " jerk_travel",
            " jerk_travel_layer_0",
            " jerk_wall",
            " jerk_wall_0",
            " jerk_wall_x",

        "Travel:",
            "retraction_enable",
            " retract_at_layer_change",
            " retraction_amount",
            " retraction_combing",
            "  retraction_combing_max_distance",
            " retraction_count_max",
            " retraction_extra_prime_amount",
            " retraction_extrusion_window",
            " retraction_hop_enabled",
            "  retraction_hop",
            "  retraction_hop_after_extruder_switch",
            "  retraction_hop_after_extruder_switch_height",
            "  retraction_hop_only_when_collides",
            " retraction_min_travel",
            " retraction_prime_speed",
            " retraction_retract_speed",
            " retraction_speed",
            "travel_avoid_distance",
            "travel_avoid_other_parts",
            "travel_avoid_supports",
            "travel_compensate_overlapping_walls_0_enabled",
            "travel_compensate_overlapping_walls_enabled",
            "travel_compensate_overlapping_walls_x_enabled",
            "travel_retract_before_outer_wall",

        "Cooling:",
            "cool_fan_enabled",
            " cool_fan_full_at_height",
            " cool_fan_full_layer",
            " cool_fan_speed",
            " cool_fan_speed_0",
            " cool_fan_speed_max",
            " cool_fan_speed_min",
            " cool_lift_head",
            " cool_min_layer_time",
            " cool_min_layer_time_fan_speed_max",
            " cool_min_speed",

        "Support:",
            "support_enable",
            " support_type",
            " support_angle",
            " support_pattern",
            " support_fan_enable",
            "  support_supported_skin_fan_speed",
            " support_join_distance",
            " support_connect_zigzags",
            " support_top_distance",
            " support_wall_count",
            " support_xy_distance",
            "  support_xy_distance_overhang",
            " support_xy_overrides_z",
            " support_z_distance",
            " support_brim_enable",
            "  support_brim_line_count",
            "  support_brim_width",
            " support_interface_enable",
            "  support_interface_angles",
            "  support_interface_density",
            "  support_interface_height",
            "  support_interface_line_width",
            "  support_interface_material_flow",
            "  support_interface_offset",
            "  support_interface_pattern",
            "  support_interface_skip_height",
            " support_infill_angles",
            " support_infill_rate",
            " support_infill_sparse_thickness",
            " support_bottom_enable",
            "  support_bottom_angles",
            "  support_bottom_density",
            "  support_bottom_distance",
            "  support_bottom_height",
            "  support_bottom_line_distance",
            "  support_bottom_line_width",
            "  support_bottom_material_flow",
            "  support_bottom_offset",
            "  support_bottom_pattern",
            "  support_bottom_stair_step_height",
            "  support_bottom_stair_step_width",
            " support_roof_enable",
            "  support_roof_angles",
            "  support_roof_density",
            "  support_roof_height",
            "  support_roof_line_distance",
            "  support_roof_line_width",
            "  support_roof_material_flow",
            "  support_roof_offset",
            "  support_roof_pattern",
            " support_use_towers",
            "  support_tower_diameter",
            "  support_tower_maximum_supported_diameter",
            "  support_tower_roof_angle",
            " gradual_support_infill_step_height",
            " gradual_support_infill_steps",
            " limit_support_retractions",
            " minimum_bottom_area",
            " minimum_interface_area",
            " minimum_polygon_circumference",
            " minimum_roof_area",
            " minimum_support_area",
            " support_line_distance",
            "  support_initial_layer_line_distance",
            " support_line_width",
            " support_material_flow",
            " support_mesh_drop_down",
            " support_offset",
            " support_skip_some_zags",
            " support_skip_zag_per_mm",
            " support_zag_skip_count",
            " zig_zaggify_support",

        "Build Plate Adhesion:",
            "adhesion_type",
            " brim_gap",
            " brim_line_count",
            " brim_outside_only",
            " brim_replaces_support",
            " brim_width",
            " skirt_brim_line_width",
            " skirt_brim_material_flow",
            " skirt_brim_minimal_length",
            " skirt_brim_speed",
            " skirt_gap",
            " skirt_line_count",
            " raft_acceleration",
            " raft_airgap",
            " raft_base_acceleration",
            " raft_base_fan_speed",
            " raft_base_jerk",
            " raft_base_line_spacing",
            " raft_base_line_width",
            " raft_base_speed",
            " raft_base_thickness",
            " raft_fan_speed",
            " raft_interface_acceleration",
            " raft_interface_fan_speed",
            " raft_interface_jerk",
            " raft_interface_line_spacing",
            " raft_interface_line_width",
            " raft_interface_speed",
            " raft_interface_thickness",
            " raft_jerk",
            " raft_margin",
            " raft_smoothing",
            " raft_speed",
            " raft_surface_acceleration",
            " raft_surface_fan_speed",
            " raft_surface_jerk",
            " raft_surface_layers",
            " raft_surface_line_spacing",
            " raft_surface_line_width",
            " raft_surface_speed",
            " raft_surface_thickness",
            " initial_layer_line_width_factor",
            " prime_blob_enable",

        "#Dual Extrusion:",
            "#ooze_shield_angle",
            "#ooze_shield_dist",
            "#ooze_shield_enabled",
            "#prime_tower_brim_enable",
            "#prime_tower_enable",
            "#prime_tower_flow",
            "#prime_tower_line_width",
            "#prime_tower_min_volume",
            "#prime_tower_position_x",
            "#prime_tower_position_y",
            "#prime_tower_size",
            "#prime_tower_wipe_enabled",
            "#switch_extruder_extra_prime_amount",
            "#switch_extruder_prime_speed",
            "#switch_extruder_retraction_amount",
            "#switch_extruder_retraction_speed",
            "#switch_extruder_retraction_speeds",

        "Mesh Fixes:",
            "alternate_carve_order",
            "alternate_extra_perimeter",
            "carve_multiple_volumes",
            "meshfix_extensive_stitching",
            "meshfix_keep_open_polygons",
            "meshfix_maximum_deviation",
            "meshfix_maximum_resolution",
            "meshfix_maximum_travel_resolution",
            "meshfix_union_all",
            "meshfix_union_all_remove_holes",
            "multiple_mesh_overlap",
            "remove_empty_first_layers",

        "Special Modes:",
            "anti_overhang_mesh",
            "cutting_mesh",
            "magic_fuzzy_skin_enabled",
            "magic_fuzzy_skin_outside_only",
            "magic_fuzzy_skin_point_density",
            "magic_fuzzy_skin_point_dist",
            "magic_fuzzy_skin_thickness",
            "magic_mesh_surface_mode",
            "magic_spiralize",
            "mold_angle",
            "mold_enabled",
            "mold_roof_height",
            "mold_width",
            "print_sequence",
            "relative_extrusion",
            "smooth_spiralized_contours",
            "support_mesh",

        "Experimental:",
            "bridge_settings_enabled",
            " bridge_enable_more_layers",
            " bridge_fan_speed",
            " bridge_fan_speed_2",
            " bridge_fan_speed_3",
            " bridge_skin_density",
            " bridge_skin_density_2",
            " bridge_skin_density_3",
            " bridge_skin_material_flow",
            " bridge_skin_material_flow_2",
            " bridge_skin_material_flow_3",
            " bridge_skin_speed",
            " bridge_skin_speed_2",
            " bridge_skin_speed_3",
            " bridge_skin_support_threshold",
            " bridge_sparse_infill_max_density",
            " bridge_wall_coast",
            " bridge_wall_material_flow",
            " bridge_wall_min_length",
            " bridge_wall_speed",
            "center_object",
            "clean_between_layers",
            "coasting_enable",
            " coasting_min_volume",
            " coasting_speed",
            " coasting_volume",
            "conical_overhang_enabled",
            " conical_overhang_angle",
            "cross_infill_density_image",
            "cross_infill_pocket_size",
            "cross_support_density_image",
            "draft_shield_enabled",
            " draft_shield_dist",
            " draft_shield_height",
            " draft_shield_height_limitation",
            "flow_rate_extrusion_offset_factor",
            "flow_rate_max_extrusion_offset",
            "max_extrusion_before_wipe",
            "max_skin_angle_for_expansion",
            "mesh_position_x",
            "mesh_position_y",
            "mesh_position_z",
            "mesh_rotation_matrix",
            "roofing_angles",
            "roofing_layer_count",
            "roofing_line_width",
            "roofing_material_flow",
            "roofing_pattern",
            "slicing_tolerance",
            "small_feature_max_length",
            "small_feature_speed_factor",
            "small_feature_speed_factor_0",
            "small_hole_max_size",
            "spaghetti_infill_enabled",
            " spaghetti_flow",
            " spaghetti_infill_extra_volume",
            " spaghetti_infill_stepped",
            " spaghetti_inset",
            " spaghetti_max_height",
            " spaghetti_max_infill_angle",
            "support_conical_angle",
            "support_conical_min_width",
            "support_tree_enable",
            " support_tree_angle",
            " support_tree_branch_diameter",
            " support_tree_branch_diameter_angle",
            " support_tree_branch_distance",
            " support_tree_collision_resolution",
            "wipe_brush_pos_x",
            "wipe_hop_enable",
            " wipe_hop_amount",
            " wipe_hop_speed",
            "wipe_move_distance",
            "wipe_pause",
            "wipe_repeat_count",
            "wipe_retraction_enable",
            " wipe_retraction_amount",
            " wipe_retraction_extra_prime_amount",
            " wipe_retraction_prime_speed",
            " wipe_retraction_retract_speed",
            " wipe_retraction_speed",
            "wireframe_enabled",
            " wireframe_bottom_delay",
            " wireframe_drag_along",
            " wireframe_fall_down",
            " wireframe_flat_delay",
            " wireframe_flow",
            " wireframe_flow_connection",
            " wireframe_flow_flat",
            " wireframe_height",
            " wireframe_nozzle_clearance",
            " wireframe_printspeed",
            " wireframe_printspeed_bottom",
            " wireframe_printspeed_down",
            " wireframe_printspeed_flat",
            " wireframe_printspeed_up",
            " wireframe_roof_drag_along",
            " wireframe_roof_fall_down",
            " wireframe_roof_inset",
            " wireframe_roof_outer_delay",
            " wireframe_straight_before_down",
            " wireframe_strategy",
            " wireframe_top_delay",
            " wireframe_top_jump",
            " wireframe_up_half_speed"
    ]
};