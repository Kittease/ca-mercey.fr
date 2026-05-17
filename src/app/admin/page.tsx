"use client";

import AdminHeader from "./_components/admin-header";
import PhotoLayout from "./_components/photo-layout";
import PhotoWrapper from "./_components/photo-wrapper/select";
import { PhotoSelectionProvider } from "./_components/photo-wrapper/select/context";

const RAW_PHOTOS = [
  {
    src: "https://ca-mercey.fr/img/gallery/20150719_1339.jpg",
    width: 1536,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20150719_1744.jpg",
    width: 1699,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20150721_1611.jpg",
    width: 1536,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20150721_1659.jpg",
    width: 1920,
    height: 1596,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20150809_1825.jpg",
    width: 1920,
    height: 1536,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20160121_1505.jpg",
    width: 1920,
    height: 1536,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20170213_1336.jpg",
    width: 1920,
    height: 1149,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20170622_1124.jpg",
    width: 1920,
    height: 1228,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20170622_1933.jpg",
    width: 1920,
    height: 1080,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20170814_2018.jpg",
    width: 886,
    height: 1108,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20170815_0718.jpg",
    width: 1920,
    height: 1536,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20170816_2046.jpg",
    width: 1920,
    height: 1080,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20170909_1956.jpg",
    width: 1920,
    height: 1536,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20170909_1958.jpg",
    width: 1920,
    height: 1342,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20171031_1703.jpg",
    width: 1920,
    height: 1536,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20171224_1559.jpg",
    width: 1920,
    height: 1229,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20171224_1643.jpg",
    width: 1920,
    height: 1258,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20171230_1719.jpg",
    width: 1920,
    height: 1315,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20180410_0035.jpg",
    width: 1920,
    height: 1175,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20180410_0039.jpg",
    width: 1536,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20180520_1534.jpg",
    width: 1809,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20180520_1621.jpg",
    width: 1920,
    height: 1399,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20180521_0908.jpg",
    width: 1920,
    height: 1235,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20180521_0943.jpg",
    width: 1920,
    height: 1536,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20180616_0758.jpg",
    width: 1920,
    height: 1831,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20180805_2016.jpg",
    width: 1920,
    height: 1536,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20180806_2036.jpg",
    width: 1920,
    height: 1857,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20180808_2026.jpg",
    width: 1920,
    height: 1405,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20180809_1550.jpg",
    width: 1920,
    height: 1409,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20180810_0715.jpg",
    width: 1920,
    height: 1816,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20180810_0730.jpg",
    width: 1920,
    height: 1574,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20180903_2012.jpg",
    width: 1920,
    height: 1574,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20180908_2000.jpg",
    width: 1920,
    height: 1440,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20181014_1929.jpg",
    width: 1728,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20181014_2230.jpg",
    width: 1920,
    height: 1748,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20181021_1730.jpg",
    width: 1673,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20181021_1750.jpg",
    width: 1440,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20181021_1751.jpg",
    width: 1536,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20181021_1809.jpg",
    width: 1920,
    height: 1423,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20181021_1833.jpg",
    width: 1920,
    height: 1440,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20181025_2114.jpg",
    width: 1853,
    height: 1408,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20181110_1800.jpg",
    width: 1536,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20181110_1807.jpg",
    width: 1536,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20181124_1434.jpg",
    width: 1920,
    height: 1425,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20181223_1612.jpg",
    width: 1440,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20181223_1617.jpg",
    width: 1920,
    height: 1469,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20181223_1619.jpg",
    width: 1440,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20181223_1631.jpg",
    width: 1920,
    height: 1440,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20181223_1632.jpg",
    width: 1440,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20181223_1738.jpg",
    width: 1920,
    height: 1779,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20181223_1745.jpg",
    width: 1536,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20181224_1624.jpg",
    width: 1376,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20181224_1703.jpg",
    width: 1436,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20181225_1151.jpg",
    width: 1536,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20181225_1203.jpg",
    width: 1442,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20181225_1349.jpg",
    width: 1440,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20181225_1411.jpg",
    width: 1536,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20181225_1415.jpg",
    width: 1536,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20181225_1419.jpg",
    width: 1920,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20181225_1458.jpg",
    width: 1920,
    height: 1440,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20181227_1606.jpg",
    width: 1920,
    height: 1440,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20181227_1634.jpg",
    width: 1536,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20181227_1651.jpg",
    width: 1536,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20181227_1752.jpg",
    width: 1920,
    height: 1371,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20181228_1342.jpg",
    width: 1536,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20181228_1357.jpg",
    width: 1920,
    height: 1524,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20181228_1516.jpg",
    width: 1536,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20181228_1518.jpg",
    width: 1920,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20181228_1522.jpg",
    width: 1568,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20181228_1532.jpg",
    width: 1920,
    height: 1440,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20181228_1601.jpg",
    width: 1661,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20181228_1603.jpg",
    width: 1440,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20181228_1703.jpg",
    width: 1369,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20181229_1757.jpg",
    width: 1536,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20181229_1808.jpg",
    width: 1920,
    height: 803,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20181229_1814.jpg",
    width: 1536,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20190118_1052.jpg",
    width: 1920,
    height: 1364,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20190121_1938.jpg",
    width: 1536,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20190122_1704.jpg",
    width: 1536,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20190125_2000.jpg",
    width: 1920,
    height: 1492,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20190127_1602.jpg",
    width: 1714,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20190127_1821.jpg",
    width: 1536,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20190202_1339.jpg",
    width: 1920,
    height: 1777,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20190202_1609.jpg",
    width: 1536,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20190202_1650.jpg",
    width: 1536,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20190202_1704.jpg",
    width: 1920,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20190202_1736.jpg",
    width: 1920,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20190202_1752.jpg",
    width: 1920,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20190215_1659.jpg",
    width: 1583,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20190215_1751.jpg",
    width: 1326,
    height: 1657,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20190302_1936.jpg",
    width: 1459,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20190302_2007.jpg",
    width: 1320,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20190303_2020.jpg",
    width: 1920,
    height: 1563,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20190308_1931.jpg",
    width: 1486,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20190314_1845.jpg",
    width: 1920,
    height: 1536,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20190315_1106.jpg",
    width: 1536,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20190320_1211.jpg",
    width: 1500,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20190320_1216.jpg",
    width: 1513,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20190406_1318.jpg",
    width: 1536,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20190406_1707.jpg",
    width: 1920,
    height: 1536,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20190420_1425.jpg",
    width: 1920,
    height: 1536,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20190420_1514.jpg",
    width: 1440,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20190420_1537.jpg",
    width: 1536,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20190420_1553.jpg",
    width: 1703,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20190420_1554.jpg",
    width: 1536,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20190420_1604.jpg",
    width: 1536,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20190504_1439.jpg",
    width: 1536,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20190505_1251.jpg",
    width: 1536,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20190505_1612.jpg",
    width: 1920,
    height: 812,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20190506_1012.jpg",
    width: 1920,
    height: 661,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20190506_1410.jpg",
    width: 1536,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20190506_1616.jpg",
    width: 1920,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20190531_0902.jpg",
    width: 1536,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20190602_1320.jpg",
    width: 1652,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20190606_1135.jpg",
    width: 1440,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20190606_1208.jpg",
    width: 1920,
    height: 1440,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20190606_1721.jpg",
    width: 1536,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20190606_1800.jpg",
    width: 1536,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20190606_1905.jpg",
    width: 1536,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20190606_1922.jpg",
    width: 1920,
    height: 1536,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20190606_2115.jpg",
    width: 1536,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20190710_2243.jpg",
    width: 1536,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20190722_2118.jpg",
    width: 1536,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20190722_2202.jpg",
    width: 1536,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20190722_2305.jpg",
    width: 1536,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20190729_2008.jpg",
    width: 1536,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20190801_1843.jpg",
    width: 1606,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20190802_2027.jpg",
    width: 1536,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20190802_2147.jpg",
    width: 1920,
    height: 1116,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20190802_2153.jpg",
    width: 1920,
    height: 1006,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20190803_1955.jpg",
    width: 1920,
    height: 1413,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20190803_2117.jpg",
    width: 1536,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20190804_1503.jpg",
    width: 1536,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20190805_1104.jpg",
    width: 1536,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20190805_1308.jpg",
    width: 1920,
    height: 1223,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20190805_1836.jpg",
    width: 1536,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20190806_1519.jpg",
    width: 1536,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20190806_1530.jpg",
    width: 1669,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20190807_1612.jpg",
    width: 1536,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20190808_1924.jpg",
    width: 1536,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20200119_0848.jpg",
    width: 1536,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20200119_0851.jpg",
    width: 1536,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20200613_1450.jpg",
    width: 1536,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20200613_1457.jpg",
    width: 1536,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20200613_1532.jpg",
    width: 1536,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20200613_1612.jpg",
    width: 1536,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20200625_1442.jpg",
    width: 1536,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20200806_1331.jpg",
    width: 1536,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20200806_1337.jpg",
    width: 1536,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20200806_1338.jpg",
    width: 1536,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20200806_1358.jpg",
    width: 1536,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20200910_1429.jpg",
    width: 1536,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20200910_1443.jpg",
    width: 1536,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20201204_2001.jpg",
    width: 1536,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20210205_1545.jpg",
    width: 1440,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20210206_1224.jpg",
    width: 1536,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20210314_1632.jpg",
    width: 1536,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20210515_1257.jpg",
    width: 1536,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20210630_2139.jpg",
    width: 1536,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20210630_2140.jpg",
    width: 1536,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20210706_1627.jpg",
    width: 1536,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20210812_1641.jpg",
    width: 1536,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20210812_1657.jpg",
    width: 1536,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20210812_1659.jpg",
    width: 1536,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20210812_1701.jpg",
    width: 1536,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20210818_1930.jpg",
    width: 1377,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20210818_1931.jpg",
    width: 1468,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20210818_1933.jpg",
    width: 1536,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20210818_1944.jpg",
    width: 1536,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20210903_1839.jpg",
    width: 1536,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20210917_2205.jpg",
    width: 1536,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20210925_2324.jpg",
    width: 1920,
    height: 1536,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20210926_0022.jpg",
    width: 1920,
    height: 1536,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20210926_0055.jpg",
    width: 1920,
    height: 1536,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20210926_0056.jpg",
    width: 1920,
    height: 1280,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20211117_1850.jpg",
    width: 1920,
    height: 1327,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20210417_1134.jpg",
    width: 1536,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20210712_2126.jpg",
    width: 1920,
    height: 1536,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20210926_0317.jpg",
    width: 1920,
    height: 1280,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20211029_2322.jpg",
    width: 1536,
    height: 1920,
  },
  {
    src: "https://ca-mercey.fr/img/gallery/20211203_2325.jpg",
    width: 1920,
    height: 1280,
  },
].reverse();

const AdminDashboard = () => {
  return (
    <PhotoSelectionProvider>
      <AdminHeader />
      <PhotoLayout photos={RAW_PHOTOS} PhotoWrapper={PhotoWrapper} />
    </PhotoSelectionProvider>
  );
};

export default AdminDashboard;
