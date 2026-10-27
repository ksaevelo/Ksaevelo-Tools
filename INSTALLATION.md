# Ksaevelo Tools --- Installation Guide

**Version:** v0.0.1\
**Platform:** Windows\
**Host:** Adobe After Effects 2020 and newer (compatibility may vary)

## Install

1.  Download the official `Ksaevelo Tools` ZIP from [GitHub
    Releases](https://github.com/ksaevelo/Ksaevelo-Tools/releases).

2.  Extract the ZIP file. **Do not** put the ZIP itself inside the
    extensions directory.

3.  Close Adobe After Effects.

4.  Open File Explorer and navigate to:

    ``` text
    C:\Program Files\Common Files\Adobe\CEP\extensions\
    ```

5.  Copy the extracted **Ksaevelo Tools** extension folder into that
    directory. If the `extensions` folder does not exist, create it.
    Windows may request administrator permission.

6.  Check the folder structure. These paths should exist:

    ``` text
    C:\Program Files\Common Files\Adobe\CEP\extensions\Ksaevelo Tools\CSXS\
    C:\Program Files\Common Files\Adobe\CEP\extensions\Ksaevelo Tools\client\
    C:\Program Files\Common Files\Adobe\CEP\extensions\Ksaevelo Tools\host\
    ```

    Avoid accidental double nesting such as
    `Ksaevelo Tools\Ksaevelo Tools\CSXS`.

7.  Start After Effects and look under **Window → Extensions** for
    **Ksaevelo Tools**. In some After Effects versions the menu may be
    named **Extensions (Legacy)**.

## Updating

1.  Back up your existing `Ksaevelo Tools` folder.
2.  Close After Effects.
3.  Replace the extension folder with the files from the new official
    release.
4.  Restart After Effects.

The extension's GitHub update notification **announces releases**; it
does not automatically install updates.

## Troubleshooting

-   **Panel does not appear:** Verify the folder layout above, restart
    After Effects, and confirm the installed build supports your AE
    version.
-   **Panel is blocked or blank:** Some unsigned CEP extensions require
    additional CEP debug/developer-mode configuration. Follow Adobe's
    guidance appropriate to your AE/CEP version; avoid changing system
    settings based on unverified instructions.
-   **Presets do not apply:** Select a compatible layer, confirm
    required effects/plugins are installed, and check whether the preset
    supports your After Effects version.
-   **Problems after updating:** Restore your backup and report the
    issue with your After Effects version and steps to reproduce.

## License

Ksaevelo Tools is free to use. See [LICENSE](LICENSE) for copyright and
distribution restrictions. Third-party components remain subject to
their own licenses.

## Official links

-   [GitHub repository](https://github.com/ksaevelo/Ksaevelo-Tools)
-   [GitHub
    releases](https://github.com/ksaevelo/Ksaevelo-Tools/releases)
-   [Instagram](https://instagram.com/ksaevelo)
-   [TikTok](https://tiktok.com/@ksaevelo)

© 2026 Ksaevelo. All rights reserved.
