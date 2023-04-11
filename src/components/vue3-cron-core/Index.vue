<template>
  <div class="v3c">
    <ul class="v3c-tab">
      <li class="v3c-tab-item" :class="{ 'v3c-active': tabActive == 1 }" @click="onHandleTab(1)">
        {{ state.text.Seconds.name }}
      </li>
      <li class="v3c-tab-item" :class="{ 'v3c-active': tabActive == 2 }" @click="onHandleTab(2)">
        {{ state.text.Minutes.name }}
      </li>
      <li class="v3c-tab-item" :class="{ 'v3c-active': tabActive == 3 }" @click="onHandleTab(3)">
        {{ state.text.Hours.name }}
      </li>
      <li class="v3c-tab-item" :class="{ 'v3c-active': tabActive == 4 }" @click="onHandleTab(4)">
        {{ state.text.Day.name }}
      </li>
      <li class="v3c-tab-item" :class="{ 'v3c-active': tabActive == 5 }" @click="onHandleTab(5)">
        {{ state.text.Month.name }}
      </li>
      <!--      <li class="v3c-tab-item" :class="{ 'v3c-active': tabActive == 6 }" @click="onHandleTab(6)">-->
      <!--        {{ state.text.Year.name }}-->
      <!--      </li>-->
      <!--      <li class="v3c-tab-item v3c-lang-btn" @click="state.language = state.language === 'en' ? 'cn' : 'en'">-->
      <!--        {{ state.language === 'en' ? 'cn' : 'en' }}-->
      <!--      </li>-->
    </ul>
    <!-- 秒 -->
    <div v-show="tabActive == 1" class="v3c-content">
      <!-- 每一秒 -->
      <div>
        <label for="seconds1">
          <input id="seconds1" v-model="state.second.cronEvery" type="radio" value="1" />
          {{ state.text.Seconds.every }}
        </label>
      </div>
      <!-- 每隔多久 -->
      <div class="mt-20">
        <label for="seconds2">
          <input id="seconds2" v-model="state.second.cronEvery" type="radio" value="2" />
          {{ state.text.Seconds.interval[0] }}
          <input v-model="state.second.incrementIncrement" type="number" min="1" max="60" />
          {{ state.text.Seconds.interval[1] || '' }}
          <input v-model="state.second.incrementStart" type="number" min="0" max="59" />
          {{ state.text.Seconds.interval[2] || '' }}
        </label>
      </div>
      <!-- 具体秒数 -->
      <div class="mt-20">
        <label for="seconds3">
          <input id="seconds3" v-model="state.second.cronEvery" type="radio" value="3" />
          {{ state.text.Seconds.specific }}
          <select v-model="state.second.specificSpecific" multiple>
            <option v-for="(item, index) in 60" :key="index" :value="index">{{ index }}</option>
          </select>
        </label>
      </div>
      <!-- 具体秒数 -->
      <div class="mt-20">
        <label for="seconds4">
          <input id="seconds4" v-model="state.second.cronEvery" type="radio" value="4" />
          {{ state.text.Seconds.cycle[0] }}
          <input v-model="state.second.rangeStart" type="number" min="1" max="60" />
          {{ state.text.Seconds.cycle[1] || '' }}
          <input v-model="state.second.rangeEnd" type="number" min="0" max="59" />
          {{ state.text.Seconds.cycle[2] || '' }}
        </label>
      </div>
    </div>
    <!-- 分钟 -->
    <div v-show="tabActive == 2" class="v3c-content">
      <!-- 每一秒 -->
      <div>
        <label for="minute1">
          <input id="minute1" v-model="state.minute.cronEvery" type="radio" value="1" />
          {{ state.text.Minutes.every }}
        </label>
      </div>
      <!-- 每隔多久 -->
      <div class="mt-20">
        <label for="minute2">
          <input id="minute2" v-model="state.minute.cronEvery" type="radio" value="2" />
          {{ state.text.Minutes.interval[0] }}
          <input v-model="state.minute.incrementIncrement" type="number" min="1" max="60" />
          {{ state.text.Minutes.interval[1] || '' }}
          <input v-model="state.minute.incrementStart" type="number" min="0" max="59" />
          {{ state.text.Minutes.interval[2] || '' }}
        </label>
      </div>
      <!-- 具体秒数 -->
      <div class="mt-20">
        <label for="minute3">
          <input id="minute3" v-model="state.minute.cronEvery" type="radio" value="3" />
          {{ state.text.Minutes.specific }}
          <select v-model="state.minute.specificSpecific" multiple>
            <option v-for="(item, index) in 60" :key="index" :value="index">{{ index }}</option>
          </select>
        </label>
      </div>
      <!-- 具体秒数 -->
      <div class="mt-20">
        <label for="minute4">
          <input id="minute4" v-model="state.minute.cronEvery" type="radio" value="4" />
          {{ state.text.Minutes.cycle[0] }}
          <input v-model="state.minute.rangeStart" type="number" min="1" max="60" />
          {{ state.text.Minutes.cycle[1] || '' }}
          <input v-model="state.minute.rangeEnd" type="number" min="0" max="59" />
          {{ state.text.Minutes.cycle[2] || '' }}
        </label>
      </div>
    </div>
    <!-- 小时 -->
    <div v-show="tabActive == 3" class="v3c-content">
      <!-- 每一秒 -->
      <div>
        <label for="hour1">
          <input id="hour1" v-model="state.hour.cronEvery" type="radio" value="1" />
          {{ state.text.Hours.every }}
        </label>
      </div>
      <!-- 每隔多久 -->
      <div class="mt-20">
        <label for="hour2">
          <input id="hour2" v-model="state.hour.cronEvery" type="radio" value="2" />
          {{ state.text.Hours.interval[0] }}
          <input v-model="state.hour.incrementIncrement" type="number" min="1" max="60" />
          {{ state.text.Hours.interval[1] || '' }}
          <input v-model="state.hour.incrementStart" type="number" min="0" max="59" />
          {{ state.text.Hours.interval[2] || '' }}
        </label>
      </div>
      <!-- 具体秒数 -->
      <div class="mt-20">
        <label for="hour3">
          <input id="hour3" v-model="state.hour.cronEvery" type="radio" value="3" />
          {{ state.text.Hours.specific }}
          <select v-model="state.hour.specificSpecific" multiple>
            <option v-for="(item, index) in 60" :key="index" :value="index">{{ index }}</option>
          </select>
        </label>
      </div>
      <!-- 具体秒数 -->
      <div class="mt-20">
        <label for="hour4">
          <input id="hour4" v-model="state.hour.cronEvery" type="radio" value="4" />
          {{ state.text.Hours.cycle[0] }}
          <input v-model="state.hour.rangeStart" type="number" min="1" max="60" />
          {{ state.text.Hours.cycle[1] || '' }}
          <input v-model="state.hour.rangeEnd" type="number" min="0" max="59" />
          {{ state.text.Hours.cycle[2] || '' }}
        </label>
      </div>
    </div>
    <!-- 天 -->
    <div v-show="tabActive == 4" class="v3c-content">
      <!-- 1 -->
      <div>
        <label for="day1">
          <input id="day1" v-model="state.day.cronEvery" type="radio" value="1" />
          {{ state.text.Day.every }}
        </label>
      </div>
      <!-- 2 -->
      <div class="mt-20">
        <label for="day2">
          <input id="day2" v-model="state.day.cronEvery" type="radio" value="2" />
          {{ state.text.Day.intervalWeek[0] }}
          <input v-model="state.day.incrementIncrement" type="number" min="1" max="60" />
          {{ state.text.Day.intervalWeek[1] }}
          <input v-model="state.day.incrementStart" type="number" min="0" max="59" />
          {{ state.text.Day.intervalWeek[2] }}
        </label>
      </div>
      <!-- 3 -->
      <div class="mt-20">
        <label for="day3">
          <input id="day3" v-model="state.day.cronEvery" type="radio" value="3" />
          {{ state.text.Day.intervalDay[0] }}
          <input v-model="state.hour.rangeStart" type="number" min="1" max="30" />
          {{ state.text.Day.intervalDay[1] }}
          <input v-model="state.hour.rangeEnd" type="number" min="1" max="30" />
          {{ state.text.Day.intervalDay[2] }}
        </label>
      </div>
      <!-- 4 -->
      <div class="mt-20">
        <label for="day4">
          <input id="day4" v-model="state.day.cronEvery" type="radio" value="4" />
          {{ state.text.Day.specificWeek }}
          <select v-model="state.week.specificSpecific" multiple>
            <option
              v-for="(val, index) in 7"
              :key="index"
              :value="['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][val - 1]"
            >
              {{ state.text.Week[val - 1] }}
            </option>
          </select>
        </label>
      </div>
      <!-- 5 -->
      <div class="mt-20">
        <label for="day5">
          <input id="day5" v-model="state.day.cronEvery" type="radio" value="5" />
          {{ state.text.Day.specificDay }}
          <select v-model="state.week.specificSpecific" multiple>
            <option v-for="(val, index) in 31" :key="index" :value="val">
              {{ val }}
            </option>
          </select>
        </label>
      </div>
      <!-- 6 -->
      <div class="mt-20">
        <label for="day6">
          <input id="day6" v-model="state.day.cronEvery" type="radio" value="6" />
          {{ state.text.Day.lastDay }}
        </label>
      </div>
      <!-- 7 -->
      <div class="mt-20">
        <label for="day7">
          <input id="day7" v-model="state.day.cronEvery" type="radio" value="7" />
          {{ state.text.Day.lastWeekday }}
        </label>
      </div>
      <!-- 8 -->
      <div class="mt-20">
        <label for="day8">
          <input id="day8" v-model="state.day.cronEvery" type="radio" value="8" />
          {{ state.text.Day.lastWeek[0] }}
          <select v-model="state.day.cronLastSpecificDomDay">
            <option v-for="(val, index) in 7" :key="index" :value="val">
              {{ state.text.Week[val - 1] }}
            </option>
          </select>
          {{ state.text.Day.lastWeek[1] || '' }}
        </label>
      </div>
      <!-- 9 -->
      <div class="mt-20">
        <label for="day9">
          <input id="day9" v-model="state.day.cronEvery" type="radio" value="9" />
          <input v-model="state.day.cronDaysBeforeEomMinus" type="number" min="1" max="31" />
          {{ state.text.Day.beforeEndMonth[0] }}
        </label>
      </div>
      <!-- 10 -->
      <div class="mt-20">
        <label for="day10">
          <input id="day10" v-model="state.day.cronEvery" type="radio" value="10" />
          {{ state.text.Day.nearestWeekday[0] }}
          <input v-model="state.day.cronDaysNearestWeekday" type="number" :min="1" :max="31" />
          {{ state.text.Day.nearestWeekday[1] }}
        </label>
      </div>
      <!-- 11 -->
      <div class="mt-20">
        <label for="day11">
          <input id="day11" v-model="state.day.cronEvery" type="radio" value="11" />
          {{ state.text.Day.someWeekday[0] }}
          <input v-model="state.week.cronNthDayNth" type="number" :min="1" :max="5" />
          &nbsp;
          <select v-model="state.week.cronNthDayDay">
            <option v-for="(val, index) in 7" :key="index" :value="val">
              {{ state.text.Week[val - 1] }}
            </option>
          </select>
          {{ state.text.Day.someWeekday[1] }}
        </label>
      </div>
    </div>
    <!-- 月 -->
    <div v-show="tabActive == 5" class="v3c-content">
      <!-- 1 -->
      <div>
        <label for="month1">
          <input id="month1" v-model="state.month.cronEvery" type="radio" value="1" />
          {{ state.text.Month.every }}
        </label>
      </div>
      <!-- 2 -->
      <div class="mt-20">
        <label for="month2">
          <input id="month2" v-model="state.month.cronEvery" type="radio" value="2" />
          {{ state.text.Month.interval[0] }}
          <input v-model="state.month.incrementIncrement" type="number" :min="0" :max="12" />
          {{ state.text.Month.interval[1] }}
          <input v-model="state.month.incrementStart" type="number" :min="0" :max="12" />
        </label>
      </div>
      <!-- 3 -->
      <div class="mt-20">
        <label for="month3">
          <input id="month3" v-model="state.month.cronEvery" type="radio" value="3" />
          {{ state.text.Month.specific }}
          <select v-model="state.month.specificSpecific" multiple>
            <option v-for="(val, index) in 12" :key="index" :value="val">
              {{ val }}
            </option>
          </select>
        </label>
      </div>
      <!-- 4 -->
      <div class="mt-20">
        <label for="month4">
          <input id="month4" v-model="state.month.cronEvery" type="radio" value="4" />
          {{ state.text.Month.cycle[0] }}
          <input v-model="state.month.rangeStart" type="number" :min="1" :max="12" />
          {{ state.text.Month.cycle[1] }}
          <input v-model="state.month.rangeEnd" type="number" :min="1" :max="12" />
        </label>
      </div>
    </div>
    <!-- 年 -->
    <div v-show="tabActive == 6" class="v3c-content">
      <!-- 1 -->
      <div>
        <label for="year1">
          <input id="year1" v-model="state.year.cronEvery" type="radio" value="1" />
          {{ state.text.Year.every }}
        </label>
      </div>
      <!-- 2 -->
      <div class="mt-20">
        <label for="year2">
          <input id="year2" v-model="state.year.cronEvery" type="radio" value="2" />
          {{ state.text.Year.interval[0] }}
          <input v-model="state.year.incrementIncrement" type="number" :min="1" :max="99" />
          {{ state.text.Year.interval[1] }}
          <input v-model="state.year.incrementStart" type="number" :min="currYear" :max="currYear + 10" />
        </label>
      </div>
      <!-- 3 -->
      <div class="mt-20">
        <label for="year3">
          <input id="year3" v-model="state.year.cronEvery" type="radio" value="3" />
          {{ state.text.Year.specific }}
          <select v-model="state.year.specificSpecific" multiple>
            <option v-for="(val, index) in 100" :key="index" :value="currYear + val">
              {{ currYear + val }}
            </option>
          </select>
        </label>
      </div>
      <!-- 4 -->
      <div class="mt-20">
        <label for="year3">
          <input id="year3" v-model="state.year.cronEvery" type="radio" value="4" />
          {{ state.text.Year.cycle[0] }}
          <input v-model="state.month.rangeStart" type="number" :min="currYear" :max="currYear + 10" />
          {{ state.text.Year.cycle[1] }}
          <input v-model="state.month.rangeEnd" type="number" :min="currYear" :max="currYear + 10" />
        </label>
      </div>
    </div>
    <!-- 结果 -->
    <div class="v3c-footer">
      <div style="flex: 1">
        CRON &nbsp;: &nbsp;&nbsp;<span class="cron">{{ state.cron }}</span>
        &nbsp; &nbsp; &nbsp;
        <!--        <button class="btn-ok" @click.stop="handleChange">{{ state.text.Save }}</button>-->
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, computed, toRefs, defineComponent, ref, watch } from 'vue';
import Language from './language';

export default defineComponent({
  name: 'Vue3CronCore',
  props: {
    i18n: {},
    maxHeight: String,
    change: Function,
    value: String,
  },
  setup(props, { emit }) {
    const { i18n } = toRefs(props);
    const state = reactive({
      language: i18n.value,
      second: {
        cronEvery: '1',
        incrementStart: 3,
        incrementIncrement: 5,
        rangeStart: 0,
        rangeEnd: 0,
        specificSpecific: [],
      },
      minute: {
        cronEvery: '1',
        incrementStart: 3,
        incrementIncrement: 5,
        rangeStart: 0,
        rangeEnd: 0,
        specificSpecific: [],
      },
      hour: {
        cronEvery: '1',
        incrementStart: 3,
        incrementIncrement: 5,
        rangeStart: 0,
        rangeEnd: 0,
        specificSpecific: [],
      },
      day: {
        cronEvery: '1',
        incrementStart: 1,
        incrementIncrement: 1,
        rangeStart: 0,
        rangeEnd: 0,
        specificSpecific: [],
        cronLastSpecificDomDay: 1,
        cronDaysBeforeEomMinus: 0,
        cronDaysNearestWeekday: 1,
      },
      week: {
        cronEvery: '1',
        incrementStart: 1,
        incrementIncrement: 1,
        specificSpecific: [],
        cronNthDayDay: 1,
        cronNthDayNth: 1,
      },
      month: {
        cronEvery: '1',
        incrementStart: 3,
        incrementIncrement: 5,
        rangeStart: 1,
        rangeEnd: 1,
        specificSpecific: [],
      },
      year: {
        cronEvery: '1',
        incrementStart: 2022,
        incrementIncrement: 1,
        rangeStart: 1,
        rangeEnd: 1,
        specificSpecific: [],
      },
      output: {
        second: '',
        minute: '',
        hour: '',
        day: '',
        month: '',
        Week: '',
        year: '',
      },
      text: computed(() => Language[state.language || 'cn']),
      secondsText: computed(() => {
        let seconds = '';
        const { cronEvery } = state.second;
        switch (cronEvery.toString()) {
          case '1':
            seconds = '*';
            break;
          case '2':
            seconds = `${state.second.incrementStart}/${state.second.incrementIncrement}`;
            break;
          case '3':
            state.second.specificSpecific.map((val) => {
              seconds += `${val},`;
            });
            seconds = seconds.slice(0, -1);
            break;
          case '4':
            seconds = `${state.second.rangeStart}-${state.second.rangeEnd}`;
            break;
        }
        return seconds;
      }),
      minutesText: computed(() => {
        let minutes = '';
        const { cronEvery } = state.minute;
        switch (cronEvery.toString()) {
          case '1':
            minutes = '*';
            break;
          case '2':
            minutes = `${state.minute.incrementStart}/${state.minute.incrementIncrement}`;
            break;
          case '3':
            state.minute.specificSpecific.map((val) => {
              minutes += `${val},`;
            });
            minutes = minutes.slice(0, -1);
            break;
          case '4':
            minutes = `${state.minute.rangeStart}-${state.minute.rangeEnd}`;
            break;
        }
        return minutes;
      }),
      hoursText: computed(() => {
        let hours = '';
        const { cronEvery } = state.hour;
        switch (cronEvery.toString()) {
          case '1':
            hours = '*';
            break;
          case '2':
            hours = `${state.hour.incrementStart}/${state.hour.incrementIncrement}`;
            break;
          case '3':
            state.hour.specificSpecific.map((val) => {
              hours += `${val},`;
            });
            hours = hours.slice(0, -1);
            break;
          case '4':
            hours = `${state.hour.rangeStart}-${state.hour.rangeEnd}`;
            break;
        }
        return hours;
      }),
      daysText: computed(() => {
        let days = '';
        const { cronEvery } = state.day;
        switch (cronEvery.toString()) {
          case '1':
            break;
          case '2':
          case '4':
          case '11':
            days = '?';
            break;
          case '3':
            days = `${state.day.incrementStart}/${state.day.incrementIncrement}`;
            break;
          case '5':
            state.day.specificSpecific.map((val) => {
              days += `${val},`;
            });
            days = days.slice(0, -1);
            break;
          case '6':
            days = 'L';
            break;
          case '7':
            days = 'LW';
            break;
          case '8':
            days = `${state.day.cronLastSpecificDomDay}L`;
            break;
          case '9':
            days = `L-${state.day.cronDaysBeforeEomMinus}`;
            break;
          case '10':
            days = `${state.day.cronDaysNearestWeekday}W`;
            break;
        }
        return days;
      }),
      weeksText: computed(() => {
        let weeks = '';
        const { cronEvery } = state.day;
        switch (cronEvery.toString()) {
          case '1':
          case '3':
          case '5':
            weeks = '?';
            break;
          case '2':
            weeks = `${state.week.incrementStart}/${state.week.incrementIncrement}`;
            break;
          case '4':
            state.week.specificSpecific.map((val) => {
              weeks += `${val},`;
            });
            weeks = weeks.slice(0, -1);
            break;
          case '6':
          case '7':
          case '8':
          case '9':
          case '10':
            weeks = '?';
            break;
          case '11':
            weeks = `${state.week.cronNthDayDay}#${state.week.cronNthDayNth}`;
            break;
        }
        return weeks;
      }),
      monthsText: computed(() => {
        let months = '';
        const { cronEvery } = state.month;
        switch (cronEvery.toString()) {
          case '1':
            months = '*';
            break;
          case '2':
            months = `${state.month.incrementStart}/${state.month.incrementIncrement}`;
            break;
          case '3':
            state.month.specificSpecific.map((val) => {
              months += `${val},`;
            });
            months = months.slice(0, -1);
            break;
          case '4':
            months = `${state.month.rangeStart}-${state.month.rangeEnd}`;
            break;
        }
        return months;
      }),
      yearsText: computed(() => {
        let years = '';
        const { cronEvery } = state.year;
        switch (cronEvery.toString()) {
          case '1':
            years = '*';
            break;
          case '2':
            years = `${state.year.incrementStart}/${state.year.incrementIncrement}`;
            break;
          case '3':
            state.year.specificSpecific.map((val) => {
              years += `${val},`;
            });
            years = years.slice(0, -1);
            break;
          case '4':
            years = `${state.year.rangeStart}-${state.year.rangeEnd}`;
            break;
        }
        return years;
      }),
      cron: computed(() => {
        return `${state.secondsText || '*'} ${state.minutesText || '*'} ${state.hoursText || '*'} ${
          state.daysText || '*'
        } ${state.monthsText || '*'} ${state.weeksText || '*'}`;
      }),
    });

    const handleChange = () => {
      if (typeof state.cron !== 'string') return false;
      emit('change', state.cron);
    };
    const rest = (data) => {
      for (const i in data) {
        if (data[i] instanceof Object) {
          this.rest(data[i]);
        } else {
          switch (typeof data[i]) {
            case 'object':
              data[i] = [];
              break;
            case 'string':
              data[i] = '';
              break;
          }
        }
      }
    };

    const tabActive = ref(1);
    const currYear = new Date().getFullYear() - 1;
    const onHandleTab = (index) => {
      tabActive.value = index;
    };

    watch(
      () => state.cron,
      (value) => {
        if (typeof state.cron !== 'string') return;
        emit('update:value', value);
      },
    );

    return {
      state,
      handleChange,
      rest,
      tabActive,
      onHandleTab,
      currYear,
    };
  },
});
</script>

<style lang="less" scoped>
.v3c {
  width: auto;
  border: 1px solid #f5f7fa;
  border-radius: 6px;
  overflow: hidden;
}
.v3c-tab {
  padding: 0;
  list-style: none;
  margin: 0;
  background-color: #f5f7fa;
  display: flex;
}

.v3c-tab-item {
  flex: 1;
  text-align: center;
  cursor: pointer;
  padding: 10px;
}

.v3c-tab-item.v3c-active {
  background-color: #5b8ff9;
  color: #ffffff;
}

.v3c-lang-btn {
  background-color: #61ddaa;
  color: #ffffff;
  /* border-radius: 10px; */
}

.v3c-content {
  padding: 20px;
  max-height: v-bind(maxHeight);
  overflow: hidden;
  overflow-y: auto;
}

.p-20 {
  padding: 20px;
}

.v3c-footer {
  background-color: #f5f7fa;
  padding-top: 10px;
  padding-bottom: 10px;
  display: flex;
  text-align: center;
}

.mt-20 {
  margin-top: 20px;
}

.v3c input[type='text'] {
  width: 80px;
}

.v3c input[type='number'] {
  width: 80px;
  height: 28px;
  border: 1px solid #d9d9d9;
}

.v3c select {
  width: 80px;
  height: 32px;
  border: 1px solid #d9d9d9;
}

.v3c select[multiple] {
  width: 80px;
  height: 100px;
  border: 1px solid #d9d9d9;
}

.btn-ok {
  line-height: 1.5715;
  position: relative;
  display: inline-block;
  font-weight: 400;
  white-space: nowrap;
  text-align: center;
  background-image: none;
  border: 1px solid transparent;
  box-shadow: 0 2px #00000004;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  touch-action: manipulation;
  height: 32px;
  padding: 4px 15px;
  font-size: 14px;
  border-radius: 2px;

  color: #fff;
  background: #5b8ff9;
  border-color: #5b8ff9;
  text-shadow: 0 -1px 0 rgb(0 0 0 / 12%);
  box-shadow: 0 2px #0000000b;
}

.btn-close {
  line-height: 1.5715;
  position: relative;
  display: inline-block;
  font-weight: 400;
  white-space: nowrap;
  text-align: center;
  background-image: none;
  border: 1px solid transparent;
  box-shadow: 0 2px #00000004;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  touch-action: manipulation;
  height: 32px;
  padding: 4px 15px;
  font-size: 14px;
  border-radius: 2px;

  color: #fff;
  background: #61ddaa;
  border-color: #61ddaa;
  text-shadow: 0 -1px 0 rgb(0 0 0 / 12%);
  box-shadow: 0 2px #0000000b;
}

.cron {
  background-color: #61ddaa;
  padding: 5px;
  padding-left: 10px;
  padding-right: 10px;
  color: #ffffff;
}

/*美化 页面*/
input,
select {
  border: 1px solid #d9d9d9;
  border-radius: 5px;
  height: 28px;
  padding: 0 5px;
  box-shadow: 0 2px #00000004;
  margin: 0 5px;
}

//去除input的 点击边框
input:focus {
  outline: none;
}

.v3c-content {
  background-color: #f5f7fa;
  & > div {
    label {
      display: flex;
      align-items: center;
    }
  }

  //美化 radio
  input[type='radio'] {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 1px solid #d9d9d9;
    margin-right: 5px;
    &:checked {
      background-color: #5b8ff9;
    }
  }
}
</style>
