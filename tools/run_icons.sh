set -e
U=/mnt/user-data/uploads;T=/home/claude/tools/iconsheet.py;O=/home/claude/work/icons
rm -rf $O;mkdir -p $O
mats(){ r=$1;f=$2;swap=$3;ks="";for g in 0 1 2 3 4 5 6 7 8 9;do ks="$ks,m_${r}_${g}_a,m_${r}_${g}_b";done;ks=${ks#,}
 if [ -n "$swap" ];then ks=$(echo $ks|sed 's/m_grk_5_a,m_grk_5_b/m_grk_5_b,m_grk_5_a/');fi
 python3 -I $T $U/$f-image.png $O 5,5,5,5 $ks; }
gear(){ t=$1;f=$2;python3 -I $T $U/$f-image.png $O 5,6 eq_${t}_armor,eq_${t}_top,eq_${t}_garment,eq_${t}_shoes,eq_${t}_acc,wp_${t}_wolf,wp_${t}_rhino,wp_${t}_owl,wp_${t}_jaguar,wp_${t}_croc,wp_${t}_axolotl; }
mats jpn 01e7a420; mats grk 7c9a8ffa swap; mats egy 06ae33a0; mats azt 2c992307; mats vik c1821dde
gear jpn 5d9c063b; gear egy 8ca6570c; gear grk 5f1f93a8; gear azt 170e89cd; gear vik 10e3aa3f
python3 -I $T $U/111e0cf1-image.png $O 4,4 orb_atk,orb_def,orb_agi,orb_vit,orb_int,orb_cha,orb_tal,orb_lck
python3 -I $T $U/f8abc102-image.png $O 7,7 capscroll,wing,ore1,ore2,ore3,ore4,drill,pliers,guard,trait_vik,trait_azt,trait_grk,trait_egy,trait_jpn
python3 -I $T $U/b1baba80-image.png $O 4,4,4,4 hp1,hp2,hp3,hp4,sp1,sp2,sp3,elixir,food_atk,food_def,food_vit,food_agi,food_tal,food_cha,manual,ret
ls $O | wc -l
STRICT=60 python3 -I $T $U/f8abc102-image.png /tmp/strict 7,7 capscroll,wing,ore1,ore2,ore3,ore4,drill,pliers,guard,trait_vik,trait_azt,trait_grk,trait_egy,trait_jpn >/dev/null && cp /tmp/strict/ore3.png $O/ore3.png
