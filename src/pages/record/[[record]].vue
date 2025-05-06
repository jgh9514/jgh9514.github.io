<template>
  <div>
    <div>
      <img :src="`${Constants.BASE_URL}/images/banner.jpg`" width="100%" />
    </div>
    <v-container>
      <v-data-table
        :headers="[
          {
            title: '유저명',
            key: 'wizard_name',
            align: 'start',
            width: '50%',
            sortable: false,
          },
          {
            title: '승률',
            key: 'total_rate',
            align: 'center',
            width: '16%',
            sortable: false,
          },
          {
            title: '승리',
            key: 'win_count',
            align: 'center',
            width: '16%',
            sortable: false,
          },
          {
            title: '패배',
            key: 'lose_count',
            align: 'center',
            width: '16%',
            sortable: false,
          },
        ]"
        :items="userList"
        items-per-page="50"
        class="userList"
        hide-default-footer
      >
        <template v-slot:item="{ item }">
          <tr>
            <td class="link" @click="goDetail(item)">
              {{ item.wizard_name }}
            </td>
            <td>
              {{ item.total_rate + "%" }}
            </td>
            <td>
              {{ item.win_count }}
            </td>
            <td>
              {{ item.lose_count }}
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-container>
  </div>
</template>
<script setup>
const schData = ref({ paging: 5, offset: 1 });
const userList = ref([]);

onMounted(async () => {
  await search();
});

const search = async () => {
  const searchData = $gfn_searchDataExtraction(schData.value);
  const res = await $api.get("/summonerswar/record-list", searchData);
  userList.value = [...res];
};

const goDetail = (user) => {
  navigateTo({
    path: "/record/detail/" + user.wizard_id,
  });
};
</script>
<style>
.v-list-item--active {
  background: #f00 !important;
}

.pagination {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}

.page-btn {
  background: #fff;
  border: 1px solid #ccc;
  color: #333;
  padding: 5px 10px;
  margin: 0 5px;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-btn.active {
  background: #f00;
  color: #fff;
}
</style>
