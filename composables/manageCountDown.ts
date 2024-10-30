export const useCountDown = () => {
    const countdown = ref(30);

    const startCountdown = () => {
        const timerInterval = setInterval(() => {
            if (countdown.value > 0) {
                countdown.value--;
                // @ts-ignore
                localStorage.setItem('timer', countdown.value);
            } else {
                clearInterval(timerInterval);
                // @ts-ignore
                localStorage.removeItem('timer');
                countdown.value = 30;
            }
        }, 1000);
    };

    onMounted(() => {
        const timer = localStorage.getItem('timer');
        if (timer) {
            countdown.value = parseInt(timer);
            startCountdown();
        }
    });

    return { startCountdown, countdown, onMounted };
};
