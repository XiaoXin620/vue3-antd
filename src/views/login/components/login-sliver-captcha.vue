<template>
    <div v-show="visible" class="captcha" style="margin-left: 30px">
        <div class="sliderPanel" style="width:300px;height: 150px">
            <div>
                <img :src="formCustom.bigImage">
            </div>
            <div class="refreshIcon" @click="reset"></div>
            <img class="block" :src="formCustom.smallImage" :style="smallImageStyle">
        </div>

        <div :class="sliderContainerClass">
            <div :style="sliderMaskStyle" class="sliderMask">
                <div :style="sliderStyle" class="slider" ref="sliderRef">
                    <span class="sliderIcon"></span>
                </div>
            </div>
            <span class="sliderText">向右滑动滑块填充拼图</span>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted, toRefs } from 'vue';
import { sliverCaptchaByImg } from '@/api/captcha';

export default defineComponent({
    name: 'LoginSliverCaptcha',
    setup(props, { emit }) {
        const formCustom = reactive({
            code: "",
            w: 288,
            h: 155,
            bigImage: '',
            smallImage: '',
            yHeight: 0,
            trail: []
        });

        const DOM = reactive({
            bigImage: '',
            block: '',
            sliderContainer: '',
            sliderPanel: '',
            refreshIcon: '',
            sliderMask: '',
            slider: '',
            sliderIcon: '',
            text: ''
        });

        const visible = ref(false);
        const smallImageStyle = reactive({
            left: '0',
            'padding-top': '0'
        });
        const sliderStyle = reactive({
            left: '0'
        });
        const sliderMaskStyle = reactive({
            width: '0'
        });
        const sliderContainerClass = ref("sliderContainer");

        const sliderRef = ref<HTMLInputElement | null>(null);;

        onMounted(() => {
            bindEvents();
        });

        const initCodeImg = async () => {
            try {
                const res = await sliverCaptchaByImg();
                Object.assign(formCustom, res);
                initImg();
                visible.value = true;
            } catch (error) {
                console.error(error);
            }
        };

        const onVerify = (width: number) => {
            emit('parentHandleSubmit', { width, code: formCustom.code });
        };

        const onSuccess = () => {
            sliderContainerClass.value = 'sliderContainer sliderContainer_success';
        };

        const onFail = () => {
            sliderContainerClass.value = 'sliderContainer sliderContainer_fail';
            smallImageStyle.left = '0';
            sliderStyle.left = '0';
            sliderMaskStyle.width = '0';
            initCodeImg();
        };

        const initImg = () => {
            smallImageStyle['padding-top'] = `${formCustom.yHeight}px`;
        };

        const bindEvents = () => {
            let originX = 0, originY = 0, blockLeft = 0, trail: number[] = [], isMouseDown = false;

            const handleMouseDown = (e: MouseEvent) => {
                originX = e.x;
                originY = e.y;
                isMouseDown = true;
            };

            const formCustomW = formCustom.w;

            const handleMouseMove = (e: MouseEvent) => {
                if (!isMouseDown) return false;
                const moveX = e.x - originX;
                const moveY = e.y - originY;
                if (moveX < 0 || moveX + 40 >= formCustomW) return false;
                sliderStyle.left = `${moveX}px`;
                blockLeft = (formCustomW - 40 - 20) / (formCustomW - 40) * moveX;
                smallImageStyle.left = `${moveX}px`;
                sliderContainerClass.value = "sliderContainer sliderContainer_active";
                sliderMaskStyle.width = `${moveX}px`;
                blockLeft = moveX;
                trail.push(moveY);
            };

            const handleMouseUp = (e: MouseEvent) => {
                console.log("handleMouseUp");
                if (!isMouseDown) return false;
                isMouseDown = false;
                if (e.x === originX) return false;
                sliderContainerClass.value = "sliderContainer";
                onVerify(parseInt(blockLeft.toString()));
            };

            sliderRef.value?.addEventListener('mousedown', handleMouseDown);
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        };

        const reset = () => {
            sliderContainerClass.value = 'sliderContainer';
            smallImageStyle.left = '0';
            sliderStyle.left = '0';
            sliderMaskStyle.width = '0';
            initCodeImg();
        };

        const hidden = () => {
            sliderContainerClass.value = 'sliderContainer';
            smallImageStyle.left = '0';
            sliderStyle.left = '0';
            sliderMaskStyle.width = '0';
            visible.value = false;
        };

        return {
            ...toRefs({ formCustom, DOM, visible, smallImageStyle, sliderStyle, sliderMaskStyle, sliderContainerClass }),
            sliderRef,
            initCodeImg,
            onVerify,
            onSuccess,
            onFail,
            initImg,
            bindEvents,
            reset,
            hidden
        };
    }
});
</script>


<style>
.captcha {
    /*margin-top: 100px;*/
}

.block {
    position: absolute;
    left: 0;
    top: 0;
}

.sliderContainer {
    position: relative;
    text-align: center;
    width: 300px;
    height: 40px;
    line-height: 40px;
    background: #f7f9fa;
    color: #45494c;
    border: 1px solid #e4e7eb;
    border-radius: 4px;
}

.sliderContainer_active .slider {
    height: 38px;
    top: -1px;
    border: 1px solid #1991FA;
}

.sliderContainer_active .sliderMask {
    height: 38px;
    border-width: 1px;
}

.sliderContainer_success .slider {
    height: 38px;
    top: -1px;
    border: 1px solid #52CCBA;
    background-color: #52CCBA !important;
}

.sliderContainer_success .sliderMask {
    height: 38px;
    border: 1px solid #52CCBA;
    background-color: #D2F4EF;
}

.sliderContainer_success .sliderIcon {
    background-position: 0 0 !important;
}

.sliderContainer_fail .slider {
    height: 38px;
    top: -1px;
    border: 1px solid #f57a7a;
    background-color: #f57a7a !important;
}

.sliderContainer_fail .sliderMask {
    height: 38px;
    border: 1px solid #f57a7a;
    background-color: #fce1e1;
}

.sliderContainer_fail .sliderIcon {
    background-position: 0 -83px !important;
}

.sliderContainer_active .sliderText,
.sliderContainer_success .sliderText,
.sliderContainer_fail .sliderText {
    display: none;
}

.sliderMask {
    position: absolute;
    left: 0;
    top: 0;
    height: 40px;
    border: 0 solid #1991FA;
    background: #D1E9FE;
}

.slider {
    position: absolute;
    top: 0;
    left: 0;
    width: 55px;
    height: 38px;
    background: #fff;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
    cursor: pointer;
    transition: background .2s linear;
}

.slider:hover {
    background: #1991FA;
}

.slider:hover .sliderIcon {
    background-position: 0 -13px;
}

.sliderIcon {
    position: absolute;
    top: 15px;
    left: 19px;
    width: 14px;
    height: 10px;
    background: url(/icon_light.f13cff3.png) 0 -26px;
    background-size: 34px 471px;
}

.refreshIcon {
    position: absolute;
    right: 30px;
    top: 0;
    width: 34px;
    height: 34px;
    cursor: pointer;
    background: url(/icon_light.f13cff3.png) 0 -437px;
    background-size: 34px 471px;
}

.sliderPanel {
    position: relative;
    background-color: #ffffff;
    /* Animation with transition in Safari and Chrome */
    -webkit-transition: all 0.6s ease-in-out;
    /* Animation with transition in Firefox (No supported Yet) */
    -moz-transition: all 0.6s ease-in-out;
    /* Animation with transition in Opera (No supported Yet)*/
    -o-transition: all 0.6s ease-in-out;
    /*!* The the opacity to 0 to create the fadeOut effect*!
      -webkit-box-shadow: #272229 2px 2px 10px;
      !* box shadow effect in Firefox*!
      -moz-box-shadow: #272229 2px 2px 10px;
      !* box shadow effect in IE*!
      filter: progid:DXImageTransform.Microsoft.Shadow(color='#272229', Direction=135, Strength=5);
      !* box shadow effect in Browsers that support it, Opera 10.5 pre-alpha release*!
      box-shadow: #272229 2px 2px 10px;*/
    height: 150px;
    margin-bottom: 20px;
}
</style>