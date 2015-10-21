jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore /media/data/Documentos/Projetos/Faltas/Google/my-release-key.keystore platforms/android/build/outputs/apk/android-release-unsigned.apk alias_name
/opt/android-sdk-update-manager/build-tools/22.0.1/zipalign -v 4 platforms/android/build/outputs/apk/android-release-unsigned.apk platforms/android/build/outputs/apk/Presente.apk
