import BitStream from "./bitstream";
import IndividualChannelStream from "./individual_channel_stream";

export default class CouplingChannelElement {
    readonly element_instance_tag: number;
    readonly ind_sw_cce_flag: boolean;
    readonly num_coupled_elements: number;
    readonly num_gain_element_lists = 0;
    readonly cc_target_is_cpe: number[] = [];
    readonly cc_target_tag_select: number[] = [];
    readonly cc_l: number[] = [];
    readonly cc_r: number[] = [];
    readonly cc_domain: boolean;
    readonly gain_element_sign: boolean;
    readonly gain_element_scale: number;
    readonly coupling: IndividualChannelStream;
    readonly cge: number;
    readonly common_gain_element_present: number[] = [];

    constructor(frequency_index: number, stream: BitStream) {
        this.element_instance_tag = stream.readBits(4);
        this.ind_sw_cce_flag = stream.readBool();
        this.num_coupled_elements = stream.readBits(3);

        for (let c = 0; c < this.num_coupled_elements + 1; c++) {
            this.num_gain_element_lists++;
            this.cc_target_is_cpe.push(stream.readBits(1));
            this.cc_target_tag_select.push(stream.readBits(4));

            if (this.cc_target_is_cpe[c]) {
                this.cc_l.push(stream.readBits(1));
                this.cc_r.push(stream.readBits(1));

                if (this.cc_l[c] && this.cc_r[c]) {
                    this.num_gain_element_lists++;
                }
            }
        }

        this.cc_domain = stream.readBool();
        this.gain_element_sign = stream.readBool();
        this.gain_element_scale = stream.readBits(2);

        this.coupling = new IndividualChannelStream(frequency_index, null, stream);

        for (let c = 1; c < this.num_gain_element_lists; c++) {
            if (this.ind_sw_cce_flag) {
                this.cge = 1;
            } else {
                this.common_gain_element_present.push(stream.readBits(1));
                this.cge = this.common_gain_element_present[c];
            }

            if (this.cge) {
                // TODO: hcod_sf[common_gain_element[c]];
            } else {
                for (let g = 0; g < this.coupling.ics_info.num_window_groups; g++) {
                    for (let sfb = 0; sfb < this.coupling.ics_info.max_sfb; sfb++) {
                        // TODO: if (sfb_cb[g][sfb] != ZERO_HCB);
                    }
                }
            }
        }
    }
}