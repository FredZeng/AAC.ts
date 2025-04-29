import BitStream from './bitstream';
import IndividualChannelStream from "./individual_channel_stream";

export default class LfeChannelElement {
    readonly element_instance_tag: number;
    readonly lfe: IndividualChannelStream;

    constructor(frequency_index: number, stream: BitStream) {
        this.element_instance_tag = stream.readBits(4);
        this.lfe = new IndividualChannelStream(frequency_index, null, stream);
    }
}
