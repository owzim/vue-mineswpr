import { leftPad } from '@/core/utils';

export default {
    time(value) {
        const seconds = Math.round(value / 1000);
        const onlySeconds = seconds % 60;
        const onlyMinutes = Math.floor(seconds / 60);

        return `${leftPad(onlyMinutes, 2)}:${leftPad(onlySeconds, 2)}`;
    }
};
