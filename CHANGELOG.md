# Changelog

## [0.17.0](https://github.com/lilsnibbi/id/compare/v0.16.0...v0.17.0) (2026-09-13)


### Features

* actual enable/disable workflow support ([9bff065](https://github.com/lilsnibbi/id/commit/9bff065a88a01e2acea646e20f073b5d9d03260c))
* add base for rate limiting ([94cc6da](https://github.com/lilsnibbi/id/commit/94cc6da53b4adc11b58e93df19da62ee8f4abfb7))
* add biome override to strip trailing commas from jsonc, run biome check, mount lifecycle route ([6ae6bb1](https://github.com/lilsnibbi/id/commit/6ae6bb1484179320c84ae829802b1364d3ec398f))
* add CF workflows binding to wrangler seutp script ([e78b663](https://github.com/lilsnibbi/id/commit/e78b66395fcfe1953c43a3d410d83f193539bde6))
* add passkey registraion and management UI ([#12](https://github.com/lilsnibbi/id/issues/12)) ([937d453](https://github.com/lilsnibbi/id/commit/937d4538549731e58c870e46b36d6e2b5bb1f8af))
* add r2 setup script, update refs ([0e856f3](https://github.com/lilsnibbi/id/commit/0e856f39e31d56944c40e39a07d19ec1e35070f4))
* add rateLimiter middleware and apply it to all auth endpoints ([2eee1ce](https://github.com/lilsnibbi/id/commit/2eee1cee00bea465e5f9377f3f3230d22542d9c5))
* add route data, update sidebar, document navigation lib ([4557f37](https://github.com/lilsnibbi/id/commit/4557f377e4f082e0cdb7a2d98bf66afc7c5f81cb))
* add simple auth ratelimiter to wrangler config generation ([e9d8ef4](https://github.com/lilsnibbi/id/commit/e9d8ef4654a70207eff0a935aeb8110396a088d7))
* add test lifecycle version ([0632094](https://github.com/lilsnibbi/id/commit/06320943ed5f0d66e54f7a6f3748bdcc1e233f44))
* add usernameless passkey support, modify challenges table, update login / registration UI, introduce lucide ([d8e72bd](https://github.com/lilsnibbi/id/commit/d8e72bded6cfb68d764ee447db58c64e7a2de75f))
* admin users page ([1737a4a](https://github.com/lilsnibbi/id/commit/1737a4a8592b30f92e99118168d6b212104d5f7d))
* also mobile sidebar ([93ed9d6](https://github.com/lilsnibbi/id/commit/93ed9d680a07973396c165b7bd7a25fe4748d8dd))
* api stuff, apistatus component, run biome checker and formatter ([29845ad](https://github.com/lilsnibbi/id/commit/29845ad418a767245c4999d2ce9538ff8c38f0f9))
* auth time in id token ([2a09950](https://github.com/lilsnibbi/id/commit/2a09950391b033566812f49654b16a808373f915))
* basic components and stuff ([3228d57](https://github.com/lilsnibbi/id/commit/3228d57754321dc470fbb3b3cda055b9a1fbfc66))
* basic lifecycle engine ([06d3137](https://github.com/lilsnibbi/id/commit/06d31372004031a3e98719468afdfaf79d464cc7))
* better profile page ([39f1de1](https://github.com/lilsnibbi/id/commit/39f1de1f36fc4d429eab5c63fae18e77eca47a33))
* cache control, discovery document update, more ([92aabbd](https://github.com/lilsnibbi/id/commit/92aabbdff33e839d49cb874582dae3343e84a8d6))
* clean up scripts, use shared utils, generate build state ([63ad8cb](https://github.com/lilsnibbi/id/commit/63ad8cb2b2fcbac38efa86abf6aa1841665fd8c5))
* client secret basic advertised support ([59c0a9a](https://github.com/lilsnibbi/id/commit/59c0a9a0df1f5f0068e8f53640273470e4c0ae0f))
* dashboard deployment, env file and support for dashboard, ([fcdbef6](https://github.com/lilsnibbi/id/commit/fcdbef6ec594e65b2e8631d15e0161c7aa6a3276))
* dashboard stying update, several fixes ([#15](https://github.com/lilsnibbi/id/issues/15)) ([9483ac8](https://github.com/lilsnibbi/id/commit/9483ac8c8a9c0c9d2e8a120cb376d7cddc2fb58a))
* delete clients endpoint and ui ([ef3bf8b](https://github.com/lilsnibbi/id/commit/ef3bf8b7c742094748f4ecd7626522f7ccd3bee5))
* display the build version of the app on the dashboard ([3c71f94](https://github.com/lilsnibbi/id/commit/3c71f940f2105f8862201c525e05f6d2f2a047c5))
* experimental support for argon2id password hashing ([2787ae9](https://github.com/lilsnibbi/id/commit/2787ae97d1b028881f6d1a15f19c49be340743f3))
* fix issue sync body section ([8f2c134](https://github.com/lilsnibbi/id/commit/8f2c134279a741c07f596fdb75d429f923ce026b))
* fix oauth flow ([#60](https://github.com/lilsnibbi/id/issues/60)) ([d0cc658](https://github.com/lilsnibbi/id/commit/d0cc658548fb8bed351eb54cb6c25e4c32d08dfa))
* full profile scope support migration ([16a1868](https://github.com/lilsnibbi/id/commit/16a18680eb081fc1144a0f137b3ca9b4821ddfe6))
* generate dashboard config, update passkeys route to use workers env, setup generates worker types ([5f405c6](https://github.com/lilsnibbi/id/commit/5f405c6af8e3b3185df9a677ff6ee1a04b37ffa0))
* hide admin routes from sidebar ([90ac6c6](https://github.com/lilsnibbi/id/commit/90ac6c657da9d73246f962b771d08facf3fcd853))
* hide admin routes from sidebar ([ac865fe](https://github.com/lilsnibbi/id/commit/ac865fe80a4e6866da98b49f3bdafe276916c147))
* implement engine to control schedulding semantics including timing conflicts ([46b9b7c](https://github.com/lilsnibbi/id/commit/46b9b7cd667efaf28811e86ec1126ec1c2448155))
* include build info in sidebar ([2885142](https://github.com/lilsnibbi/id/commit/2885142f5ef2a82b1a05f675d119565fd78352a4))
* include info in id token based on scope ([#63](https://github.com/lilsnibbi/id/issues/63)) ([d9b3219](https://github.com/lilsnibbi/id/commit/d9b3219edc24c387e27887d5016fddc4ca8b22cf))
* instance settings schema and migration, flagship setup script ([77b645d](https://github.com/lilsnibbi/id/commit/77b645dd652fa9ec605286e9b576e92d8dd755e8))
* lifecycle action claiming ([afb953a](https://github.com/lilsnibbi/id/commit/afb953a78dec1051ac5aa94eadc6e341c3842832))
* lifecycle table ([9788a8c](https://github.com/lilsnibbi/id/commit/9788a8cac3c72c306b4faad83932edc3d7fde61e))
* list users endpoint ([73d0990](https://github.com/lilsnibbi/id/commit/73d099068bbccc510729bae8bd7137ef85d49d7f))
* lots of compliance change, new lib ([195bc14](https://github.com/lilsnibbi/id/commit/195bc1481b77bd7a077ecd0524b411a44a4db41e))
* migrate setup to alchemy, remove argon as a feature flag and only hashing algorithim ([732a6fb](https://github.com/lilsnibbi/id/commit/732a6fbda35fc40f0cfe221b3a52bd01c861fcb3))
* migrate to alchemy ([#16](https://github.com/lilsnibbi/id/issues/16)) ([b1b7454](https://github.com/lilsnibbi/id/commit/b1b74542b5900c9a5c8b41d57e3748c4d5b8aee5))
* more auth stuff ([ef8832c](https://github.com/lilsnibbi/id/commit/ef8832cf003341f6be3c08879133f8d170de0f83))
* more basic components and organization ([95168dd](https://github.com/lilsnibbi/id/commit/95168dd941817a488ccb1d9eaf993eefad06f09e))
* more compliance changes, this implementation passes basic compliance checks ([1a73b62](https://github.com/lilsnibbi/id/commit/1a73b62e233946d3e83624699f38d68ac4545e15))
* move password endpoint under account route group ([9549d24](https://github.com/lilsnibbi/id/commit/9549d24cce1a5a1a8755d5fd28f2c8c9b7e9e7bc))
* nescessary claims ([#66](https://github.com/lilsnibbi/id/issues/66)) ([8acdcfb](https://github.com/lilsnibbi/id/commit/8acdcfb64a5cff41a5bd4b615e7c43af07de3243))
* organize auth routes ([0510e49](https://github.com/lilsnibbi/id/commit/0510e495e7638aec64f5986e3ba8e31190f1b6df))
* organize oauth routes ([5b0f6cf](https://github.com/lilsnibbi/id/commit/5b0f6cf70a8d7941029969470fa7b1cb659454db))
* organize profile page ([f2961e4](https://github.com/lilsnibbi/id/commit/f2961e482941abbefa5f261fcb32dbcc1a7cb604))
* passkey registration UI ([5721916](https://github.com/lilsnibbi/id/commit/5721916dc07519ce3340ce28fae87ca7b141f5d2))
* passkeys ([a41f8e9](https://github.com/lilsnibbi/id/commit/a41f8e9a6ad47ccbd3cc0a783b71c661de60f7be))
* passkeys management ui ([9d37f68](https://github.com/lilsnibbi/id/commit/9d37f688dc52e1d87f3a0120a5e1a5df3060dd20))
* password change page, resolve some ts nonsense ([4c8b7d4](https://github.com/lilsnibbi/id/commit/4c8b7d4f60ad50e040498d977c3ba986d8cac4a6))
* profile page organization, generic field component, routing fixes  in api ([#75](https://github.com/lilsnibbi/id/issues/75)) ([0e73b7e](https://github.com/lilsnibbi/id/commit/0e73b7e40ea6983457978ccbedddc163604dcc04))
* remember oauth auth choice ([#61](https://github.com/lilsnibbi/id/issues/61)) ([5433360](https://github.com/lilsnibbi/id/commit/543336090fb71deeba4e1e2e801155010d0a3d3b))
* reorganize admin routes ([8cc1b8b](https://github.com/lilsnibbi/id/commit/8cc1b8b9b2073a2a531735ee7e12614ccfacdedc))
* reorganize passkeys routes ([6aecabe](https://github.com/lilsnibbi/id/commit/6aecabee8e26350bc7675233d24dbcba5308a9bc))
* reorganize well-known routes ([d4a4c36](https://github.com/lilsnibbi/id/commit/d4a4c36680ba63af68be1208132b497c7fdffa04))
* setup generates wrangler.jsonc with required secret ([7ee2b4a](https://github.com/lilsnibbi/id/commit/7ee2b4a9e980f08f3f215050d44e759563474d6a))
* split up api library, move passkey login function to login.tsx ([3463acd](https://github.com/lilsnibbi/id/commit/3463acd4a46314ff4aaa72e8fbc5e2bd37d2563a))
* start reorgnizing routes ([5b55cb1](https://github.com/lilsnibbi/id/commit/5b55cb1dd9208a5e8c69437bd2421701283427db))
* support client secret basic ([ca1d358](https://github.com/lilsnibbi/id/commit/ca1d3584c85ea4cb4d3428e9586ca84b57e45212))
* support completely hidden routes, mark bootstrap page as hidden ([252fd34](https://github.com/lilsnibbi/id/commit/252fd34c1ef57c31b2a65456bd4c5d7c1b152c78))
* support max age ([1ea09d0](https://github.com/lilsnibbi/id/commit/1ea09d0878609962b88f4eacf79420aa7f00c8a0))
* support post  auth, fix redirect bug ([90ec954](https://github.com/lilsnibbi/id/commit/90ec954a0671d3a0c3a0bc89ae75ea51ab812631))
* support prompts ([106b3f7](https://github.com/lilsnibbi/id/commit/106b3f721dfe265b36fa161bf310f24eb2336cc1))
* suppport acr values ([2839110](https://github.com/lilsnibbi/id/commit/2839110bddea09ee2e8180c81f3444e63ed5257f))
* sync issue comments too ([aebf3d6](https://github.com/lilsnibbi/id/commit/aebf3d6753ca11d3ffc250d6141701456aa2e87b))
* ui changes to passkeys page, fix bugs that caused a user to be unable to register a passkey due to usernameless passkeys implementation ([ff4436a](https://github.com/lilsnibbi/id/commit/ff4436a326c3c2e2b983a19f56099be5d59ddba6))
* update auth stuff, abstract cookies, add auth provider ([84b3642](https://github.com/lilsnibbi/id/commit/84b36420874f2c8ba946ee24d8b5997500821fbc))
* update import formatting, create migration for better session info and user management, clean up sessions endpoints ([f960f99](https://github.com/lilsnibbi/id/commit/f960f99fb328eea4ac9db2eda5e27864574378a6))
* update passowrd page to include same password validation, change remove passkey styling in passkeys page ([ef94ad6](https://github.com/lilsnibbi/id/commit/ef94ad6d33d71779f7e965b9fe3c3fcb90dc4f6a))
* update routing for security pages, use individual pages, update wrangler ([24c5cb1](https://github.com/lilsnibbi/id/commit/24c5cb1bf40fbbf16d0ae5eaeef2d1e1b7818d4e))
* user lifecycle create endpoint ([cf27a49](https://github.com/lilsnibbi/id/commit/cf27a4941b9f3dc6492f10321975576b246b10af))
* usernameless passkey login, ui updates for login/registration, fix for white screen flashbangs between reloads ([#13](https://github.com/lilsnibbi/id/issues/13)) ([9872472](https://github.com/lilsnibbi/id/commit/987247250193452971e34db41bd74a6003fc6368))
* users avatar endpoint, various fixes ([#88](https://github.com/lilsnibbi/id/issues/88)) ([876bdff](https://github.com/lilsnibbi/id/commit/876bdff54bb917a82dd2ee0326bc319036a1926f))
* verify response type in oauth flow, update ui for authorized apps and authorization page ([e8ea694](https://github.com/lilsnibbi/id/commit/e8ea694e69afe2e34bd16d627054786d55dff9e0))


### Bug Fixes

* actually store auth time ([0f6b7d3](https://github.com/lilsnibbi/id/commit/0f6b7d311506f22d60f2c46280845e25e8fa3545))
* add acr claim ([644015c](https://github.com/lilsnibbi/id/commit/644015ce36a4791a867043b8ac345c8aa22a476f))
* add an inline password length error ([6765afa](https://github.com/lilsnibbi/id/commit/6765afac0662638cfca123234fae8a993c12356f))
* add an inline password length error ([63d8c55](https://github.com/lilsnibbi/id/commit/63d8c5561c7742f2dd6cf02857ec78708f82715b))
* advertise none supported request signing alg ([22d1dd2](https://github.com/lilsnibbi/id/commit/22d1dd2ed6bff88943a81cec92e6260ae5b64421))
* bust admin user avatar cache ([e3de255](https://github.com/lilsnibbi/id/commit/e3de255daf19dd21a5e1afb4a5a87457cd2e8e9a))
* **ci:** write OSV SARIF output to workspace ([5db9891](https://github.com/lilsnibbi/id/commit/5db9891a6fa084c46c0b15676f8e05fc9dcd3edf))
* **dashboard:** correct root error component typing ([13e20b7](https://github.com/lilsnibbi/id/commit/13e20b71f8d023b6032dab067570879440a47f41))
* **db:** update D1 initialization for Drizzle 1.0 RC ([018f5e3](https://github.com/lilsnibbi/id/commit/018f5e317d1bc4a3cb529665fad7cbefb0b6074d))
* default case is now error, move execution into engine.ts ([2a68909](https://github.com/lilsnibbi/id/commit/2a6890984f8c5e69ee129343f5ada3d0d43d0ab4))
* **deps:** update dependency @simplewebauthn/browser to v14 ([ce276b6](https://github.com/lilsnibbi/id/commit/ce276b62b3b956e17b7cb37382a9a0632a9b80aa))
* **deps:** update dependency @simplewebauthn/server to v14 ([#30](https://github.com/lilsnibbi/id/issues/30)) ([b95d8ac](https://github.com/lilsnibbi/id/commit/b95d8ac8a8a82c25806d0e80c25ce7ba865b0f09))
* **deps:** update dependency @simplewebauthn/server to v14.0.1 ([735b0cc](https://github.com/lilsnibbi/id/commit/735b0cca010bc733a602eeec9f90ca4709f93fa1))
* **deps:** update dependency @types/node to v26.4.1 ([f13645b](https://github.com/lilsnibbi/id/commit/f13645bf09cc18229d10d64fc619990e0192eddd))
* **deps:** update dependency drizzle-orm to v1.0.0-rc.5-ab785fc ([e5b3825](https://github.com/lilsnibbi/id/commit/e5b38256dcf95b4ea5b299b71bdaf67e937bf2a9))
* **deps:** update dependency hono to v4.13.7 ([8be90b7](https://github.com/lilsnibbi/id/commit/8be90b738a522018e6346b4cfdb07cffdbc78a78))
* **deps:** update dependency lucide-react to v1.41.0 ([46eee25](https://github.com/lilsnibbi/id/commit/46eee25239a5296f9d96eb6280eca1155f4d401a))
* **deps:** update dependency wrangler to v4.129.0 ([98bef0d](https://github.com/lilsnibbi/id/commit/98bef0da3b323df240fade50a20f2eee857975bd))
* **deps:** update tanstack-router monorepo ([8ed8f50](https://github.com/lilsnibbi/id/commit/8ed8f50bf9ae3b0452098848cf62cd00687c6b0c))
* fix typo in openid config ([888be72](https://github.com/lilsnibbi/id/commit/888be7211f077cb2fc06fdcb8bc717b6d770c668))
* guard against a workflow not corresponding to any lifecycle_actions row ([0302e2b](https://github.com/lilsnibbi/id/commit/0302e2b0cadcd26d5691d053b37fccbaba47c41f))
* **oauth:** revoke access tokens when authorization codes are reused ([ab310ba](https://github.com/lilsnibbi/id/commit/ab310ba18e5149ad81f7137a87828703ad867f66))
* provide authorization code ID ([f2ee8c3](https://github.com/lilsnibbi/id/commit/f2ee8c37cbf8e837cc17c5be9d313c1f8bb28f5d))
* provide storedToken.id to createAccessToken ([c1866a4](https://github.com/lilsnibbi/id/commit/c1866a414f6525ce633815b854e37f013e9c8df4))
* reconcile database row if workflow creation fails ([741dee3](https://github.com/lilsnibbi/id/commit/741dee3be3635ba0d1a80e8c02521a3a8e13668a))
* return proper error if response code is missing ([32b02d5](https://github.com/lilsnibbi/id/commit/32b02d565fb85edab30886f8f44ba3c325d64ff7))
* seperate execution failure from completion persistence ([7115334](https://github.com/lilsnibbi/id/commit/7115334c54684bc445d87a3e60886850803a325c))
* use react FormEvent type ([5037984](https://github.com/lilsnibbi/id/commit/503798434b1c0ea09e1aaf326ead5641d70ad48e))
* validate body properly ([5c36a62](https://github.com/lilsnibbi/id/commit/5c36a62db1be2411a726e23a5d1b4ac4feb3f627))
* you can pass forceDestroy to the R2 stack to empty the bucket ([71df8b6](https://github.com/lilsnibbi/id/commit/71df8b685aed33ca120a401b5cab84c72a38b6df))

## [0.16.0](https://github.com/Muljax/id/compare/v0.15.0...v0.16.0) (2026-09-12)


### Features

* also mobile sidebar ([93ed9d6](https://github.com/Muljax/id/commit/93ed9d680a07973396c165b7bd7a25fe4748d8dd))

## [0.15.0](https://github.com/Muljax/id/compare/v0.14.3...v0.15.0) (2026-09-07)


### Features

* better profile page ([39f1de1](https://github.com/Muljax/id/commit/39f1de1f36fc4d429eab5c63fae18e77eca47a33))

## [0.14.3](https://github.com/Muljax/id/compare/v0.14.2...v0.14.3) (2026-09-07)


### Bug Fixes

* **dashboard:** correct root error component typing ([13e20b7](https://github.com/Muljax/id/commit/13e20b71f8d023b6032dab067570879440a47f41))
* **deps:** update tanstack-router monorepo ([8ed8f50](https://github.com/Muljax/id/commit/8ed8f50bf9ae3b0452098848cf62cd00687c6b0c))
* you can pass forceDestroy to the R2 stack to empty the bucket ([71df8b6](https://github.com/Muljax/id/commit/71df8b685aed33ca120a401b5cab84c72a38b6df))

## [0.14.2](https://github.com/thehazell/id/compare/v0.14.1...v0.14.2) (2026-09-06)


### Bug Fixes

* **ci:** write OSV SARIF output to workspace ([5db9891](https://github.com/thehazell/id/commit/5db9891a6fa084c46c0b15676f8e05fc9dcd3edf))

## [0.14.1](https://github.com/thehazell/id/compare/v0.14.0...v0.14.1) (2026-09-06)


### Bug Fixes

* bust admin user avatar cache ([e3de255](https://github.com/thehazell/id/commit/e3de255daf19dd21a5e1afb4a5a87457cd2e8e9a))

## [0.14.0](https://github.com/thehazell/id/compare/v0.13.0...v0.14.0) (2026-09-06)


### Features

* users avatar endpoint, various fixes ([#88](https://github.com/thehazell/id/issues/88)) ([876bdff](https://github.com/thehazell/id/commit/876bdff54bb917a82dd2ee0326bc319036a1926f))

## [0.13.0](https://github.com/thehazell/id/compare/v0.12.0...v0.13.0) (2026-09-06)


### Features

* admin users page ([1737a4a](https://github.com/thehazell/id/commit/1737a4a8592b30f92e99118168d6b212104d5f7d))

## [0.12.0](https://github.com/thehazell/id/compare/v0.11.0...v0.12.0) (2026-09-06)


### Features

* organize profile page ([f2961e4](https://github.com/thehazell/id/commit/f2961e482941abbefa5f261fcb32dbcc1a7cb604))
* profile page organization, generic field component, routing fixes  in api ([#75](https://github.com/thehazell/id/issues/75)) ([0e73b7e](https://github.com/thehazell/id/commit/0e73b7e40ea6983457978ccbedddc163604dcc04))

## [0.11.0](https://github.com/thehazell/id/compare/v0.10.0...v0.11.0) (2026-09-06)


### Features

* organize auth routes ([0510e49](https://github.com/thehazell/id/commit/0510e495e7638aec64f5986e3ba8e31190f1b6df))
* organize oauth routes ([5b0f6cf](https://github.com/thehazell/id/commit/5b0f6cf70a8d7941029969470fa7b1cb659454db))
* reorganize admin routes ([8cc1b8b](https://github.com/thehazell/id/commit/8cc1b8b9b2073a2a531735ee7e12614ccfacdedc))
* reorganize passkeys routes ([6aecabe](https://github.com/thehazell/id/commit/6aecabee8e26350bc7675233d24dbcba5308a9bc))
* reorganize well-known routes ([d4a4c36](https://github.com/thehazell/id/commit/d4a4c36680ba63af68be1208132b497c7fdffa04))
* start reorgnizing routes ([5b55cb1](https://github.com/thehazell/id/commit/5b55cb1dd9208a5e8c69437bd2421701283427db))

## [0.10.0](https://github.com/thehazell/id/compare/v0.9.0...v0.10.0) (2026-09-06)


### Features

* nescessary claims ([#66](https://github.com/thehazell/id/issues/66)) ([8acdcfb](https://github.com/thehazell/id/commit/8acdcfb64a5cff41a5bd4b615e7c43af07de3243))

## [0.9.0](https://github.com/thehazell/id/compare/v0.8.0...v0.9.0) (2026-09-05)


### Features

* auth time in id token ([2a09950](https://github.com/thehazell/id/commit/2a09950391b033566812f49654b16a808373f915))
* cache control, discovery document update, more ([92aabbd](https://github.com/thehazell/id/commit/92aabbdff33e839d49cb874582dae3343e84a8d6))
* client secret basic advertised support ([59c0a9a](https://github.com/thehazell/id/commit/59c0a9a0df1f5f0068e8f53640273470e4c0ae0f))
* full profile scope support migration ([16a1868](https://github.com/thehazell/id/commit/16a18680eb081fc1144a0f137b3ca9b4821ddfe6))
* include info in id token based on scope ([#63](https://github.com/thehazell/id/issues/63)) ([d9b3219](https://github.com/thehazell/id/commit/d9b3219edc24c387e27887d5016fddc4ca8b22cf))
* lots of compliance change, new lib ([195bc14](https://github.com/thehazell/id/commit/195bc1481b77bd7a077ecd0524b411a44a4db41e))
* more compliance changes, this implementation passes basic compliance checks ([1a73b62](https://github.com/thehazell/id/commit/1a73b62e233946d3e83624699f38d68ac4545e15))
* support client secret basic ([ca1d358](https://github.com/thehazell/id/commit/ca1d3584c85ea4cb4d3428e9586ca84b57e45212))
* support max age ([1ea09d0](https://github.com/thehazell/id/commit/1ea09d0878609962b88f4eacf79420aa7f00c8a0))
* support post  auth, fix redirect bug ([90ec954](https://github.com/thehazell/id/commit/90ec954a0671d3a0c3a0bc89ae75ea51ab812631))
* support prompts ([106b3f7](https://github.com/thehazell/id/commit/106b3f721dfe265b36fa161bf310f24eb2336cc1))
* suppport acr values ([2839110](https://github.com/thehazell/id/commit/2839110bddea09ee2e8180c81f3444e63ed5257f))


### Bug Fixes

* actually store auth time ([0f6b7d3](https://github.com/thehazell/id/commit/0f6b7d311506f22d60f2c46280845e25e8fa3545))
* add acr claim ([644015c](https://github.com/thehazell/id/commit/644015ce36a4791a867043b8ac345c8aa22a476f))
* advertise none supported request signing alg ([22d1dd2](https://github.com/thehazell/id/commit/22d1dd2ed6bff88943a81cec92e6260ae5b64421))
* fix typo in openid config ([888be72](https://github.com/thehazell/id/commit/888be7211f077cb2fc06fdcb8bc717b6d770c668))
* **oauth:** revoke access tokens when authorization codes are reused ([ab310ba](https://github.com/thehazell/id/commit/ab310ba18e5149ad81f7137a87828703ad867f66))
* provide authorization code ID ([f2ee8c3](https://github.com/thehazell/id/commit/f2ee8c37cbf8e837cc17c5be9d313c1f8bb28f5d))
* provide storedToken.id to createAccessToken ([c1866a4](https://github.com/thehazell/id/commit/c1866a414f6525ce633815b854e37f013e9c8df4))
* return proper error if response code is missing ([32b02d5](https://github.com/thehazell/id/commit/32b02d565fb85edab30886f8f44ba3c325d64ff7))

## [0.8.0](https://github.com/thehazell/id/compare/v0.7.0...v0.8.0) (2026-09-05)


### Features

* remember oauth auth choice ([#61](https://github.com/thehazell/id/issues/61)) ([5433360](https://github.com/thehazell/id/commit/543336090fb71deeba4e1e2e801155010d0a3d3b))

## [0.7.0](https://github.com/thehazell/id/compare/v0.6.1...v0.7.0) (2026-09-05)


### Features

* fix oauth flow ([#60](https://github.com/thehazell/id/issues/60)) ([d0cc658](https://github.com/thehazell/id/commit/d0cc658548fb8bed351eb54cb6c25e4c32d08dfa))
* list users endpoint ([73d0990](https://github.com/thehazell/id/commit/73d099068bbccc510729bae8bd7137ef85d49d7f))
* split up api library, move passkey login function to login.tsx ([3463acd](https://github.com/thehazell/id/commit/3463acd4a46314ff4aaa72e8fbc5e2bd37d2563a))

## [0.6.1](https://github.com/thehazell/id/compare/v0.6.0...v0.6.1) (2026-09-05)


### Bug Fixes

* **deps:** update dependency @simplewebauthn/server to v14.0.1 ([735b0cc](https://github.com/thehazell/id/commit/735b0cca010bc733a602eeec9f90ca4709f93fa1))
* **deps:** update dependency @types/node to v26.4.1 ([f13645b](https://github.com/thehazell/id/commit/f13645bf09cc18229d10d64fc619990e0192eddd))
* **deps:** update dependency drizzle-orm to v1.0.0-rc.5-ab785fc ([e5b3825](https://github.com/thehazell/id/commit/e5b38256dcf95b4ea5b299b71bdaf67e937bf2a9))
* **deps:** update dependency hono to v4.13.7 ([8be90b7](https://github.com/thehazell/id/commit/8be90b738a522018e6346b4cfdb07cffdbc78a78))
* **deps:** update dependency lucide-react to v1.41.0 ([46eee25](https://github.com/thehazell/id/commit/46eee25239a5296f9d96eb6280eca1155f4d401a))
* **deps:** update dependency wrangler to v4.129.0 ([98bef0d](https://github.com/thehazell/id/commit/98bef0da3b323df240fade50a20f2eee857975bd))

## [0.6.0](https://github.com/thehazell/id/compare/v0.5.4...v0.6.0) (2026-09-05)


### Features

* delete clients endpoint and ui ([ef3bf8b](https://github.com/thehazell/id/commit/ef3bf8b7c742094748f4ecd7626522f7ccd3bee5))

## [0.5.4](https://github.com/thehazell/id/compare/v0.5.3...v0.5.4) (2026-09-05)


### Bug Fixes

* **deps:** update dependency @simplewebauthn/browser to v14 ([ce276b6](https://github.com/thehazell/id/commit/ce276b62b3b956e17b7cb37382a9a0632a9b80aa))

## [0.5.3](https://github.com/thehazell/id/compare/v0.5.2...v0.5.3) (2026-09-05)


### Bug Fixes

* **deps:** update dependency @simplewebauthn/server to v14 ([#30](https://github.com/thehazell/id/issues/30)) ([b95d8ac](https://github.com/thehazell/id/commit/b95d8ac8a8a82c25806d0e80c25ce7ba865b0f09))

## [0.5.1](https://github.com/thehazell/id/compare/v0.5.0...v0.5.1) (2026-09-05)


### Bug Fixes

* **db:** update D1 initialization for Drizzle 1.0 RC ([018f5e3](https://github.com/thehazell/id/commit/018f5e317d1bc4a3cb529665fad7cbefb0b6074d))

## [0.5.0](https://github.com/thehazell/id/compare/v0.4.4...v0.5.0) (2026-09-04)


### Features

* migrate setup to alchemy, remove argon as a feature flag and only hashing algorithim ([732a6fb](https://github.com/thehazell/id/commit/732a6fbda35fc40f0cfe221b3a52bd01c861fcb3))
* migrate to alchemy ([#16](https://github.com/thehazell/id/issues/16)) ([b1b7454](https://github.com/thehazell/id/commit/b1b74542b5900c9a5c8b41d57e3748c4d5b8aee5))
