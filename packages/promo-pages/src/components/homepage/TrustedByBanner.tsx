const TrustedByBanner = () => {
	const logos = [
		{
			id: 'logo1',
			url: 'https://www.github.com/',
			light: (
				<svg
					height="50"
					viewBox="0 0 64 62"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M21.3033 49.7496C21.3033 50.0051 21.0079 50.2095 20.6355 50.2095C20.2118 50.2478 19.9164 50.0434 19.9164 49.7496C19.9164 49.4941 20.2118 49.2896 20.5842 49.2896C20.9694 49.2513 21.3033 49.4557 21.3033 49.7496ZM17.3097 49.1747C17.2198 49.4302 17.4766 49.724 17.8619 49.8007C18.1957 49.9284 18.581 49.8007 18.658 49.5452C18.7351 49.2896 18.4911 48.9958 18.1059 48.8808C17.772 48.7914 17.3996 48.9191 17.3097 49.1747ZM22.9854 48.9575C22.6131 49.0469 22.3562 49.2896 22.3948 49.5835C22.4333 49.839 22.7671 50.0051 23.1524 49.9157C23.5248 49.8262 23.7816 49.5835 23.7431 49.328C23.7045 49.0852 23.3578 48.9191 22.9854 48.9575ZM31.4348 0C13.6243 0 0 13.4531 0 31.1733C0 45.3419 8.96304 57.4663 21.7655 61.7334C23.4092 62.0273 23.987 61.018 23.987 60.1875C23.987 59.3954 23.9485 55.0261 23.9485 52.3431C23.9485 52.3431 14.9598 54.2595 13.0722 48.5359C13.0722 48.5359 11.6083 44.8181 9.50236 43.8599C9.50236 43.8599 6.56177 41.854 9.70782 41.8924C9.70782 41.8924 12.9052 42.1479 14.6645 45.1886C17.4766 50.1201 22.1893 48.702 24.0256 47.8587C24.3209 45.8146 25.1556 44.3965 26.0801 43.5532C18.902 42.7611 11.6597 41.7263 11.6597 29.4358C11.6597 25.9224 12.6356 24.1593 14.6901 21.9108C14.3563 21.0803 13.2648 17.6564 15.024 13.2359C17.7078 12.4055 23.8843 16.6854 23.8843 16.6854C26.4525 15.9699 29.2133 15.5994 31.9485 15.5994C34.6836 15.5994 37.4444 15.9699 40.0126 16.6854C40.0126 16.6854 46.1892 12.3927 48.873 13.2359C50.6322 17.6691 49.5407 21.0803 49.2068 21.9108C51.2614 24.1721 52.5198 25.9352 52.5198 29.4358C52.5198 41.7646 44.9564 42.7484 37.7783 43.5532C38.9597 44.5625 39.9613 46.4789 39.9613 49.4813C39.9613 53.7868 39.9228 59.1144 39.9228 60.162C39.9228 60.9924 40.5134 62.0017 42.1443 61.7079C54.9853 57.4663 63.6915 45.3419 63.6915 31.1733C63.6915 13.4531 49.2453 0 31.4348 0ZM12.4815 44.0643C12.3145 44.192 12.3531 44.4859 12.5714 44.7286C12.7768 44.933 13.0722 45.0225 13.2391 44.8564C13.406 44.7286 13.3675 44.4348 13.1492 44.192C12.9438 43.9876 12.6484 43.8982 12.4815 44.0643ZM11.0946 43.0294C11.0048 43.1955 11.1332 43.3999 11.39 43.5277C11.5954 43.6554 11.8523 43.6171 11.9422 43.4383C12.032 43.2722 11.9036 43.0678 11.6468 42.94C11.39 42.8633 11.1845 42.9017 11.0946 43.0294ZM15.2551 47.5777C15.0497 47.7438 15.1267 48.127 15.4221 48.3698C15.7174 48.6636 16.0898 48.702 16.2567 48.4975C16.4237 48.3314 16.3466 47.9482 16.0898 47.7054C15.8073 47.4116 15.4221 47.3732 15.2551 47.5777ZM13.7913 45.6996C13.5858 45.8274 13.5858 46.1595 13.7913 46.4534C13.9967 46.7472 14.3434 46.875 14.5104 46.7472C14.7158 46.5811 14.7158 46.249 14.5104 45.9551C14.3306 45.6613 13.9967 45.5335 13.7913 45.6996Z"
						fill="var(--text-color)"
					/>
				</svg>
			),
		},
		{
			id: 'logo2',
			url: 'https://www.musixmatch.com/',
			light: (
				<svg
					height="40"
					viewBox="0 0 229 48"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M6.51644 0.088258C4.05524 0.528184 1.89128 2.12143 0.856857 4.24972C-0.058664 6.12832 0.000785433 4.71342 0.000785433 23.7491C0.000785433 38.5758 0.0245652 40.9181 0.179134 41.5245C0.892527 44.3543 2.99704 46.4826 5.82683 47.2435C6.77802 47.4932 8.49017 47.5289 9.48892 47.303C11.0465 46.9582 11.855 46.4113 18.9889 40.9538C22.7224 38.1002 25.8137 35.7579 25.8613 35.7579C25.897 35.7579 29.0002 38.1002 32.7336 40.9538C36.5622 43.8906 39.9033 46.3518 40.367 46.6015C40.8307 46.8393 41.5441 47.1246 41.9721 47.2435C43.0065 47.517 44.8613 47.517 45.8958 47.2435C48.4996 46.5302 50.5328 44.5921 51.4364 41.9407C51.6505 41.3105 51.6623 40.5733 51.6623 23.7491V6.21155L51.377 5.34359C50.6398 3.08451 48.7255 1.19402 46.3595 0.385505C45.4796 0.088258 45.1943 0.0406985 43.9339 0.0406985C42.6855 0.0406985 42.3882 0.088258 41.5559 0.373615C41.0328 0.551964 40.3432 0.861101 40.0103 1.06323C39.6892 1.26536 36.3957 3.70278 32.7099 6.48502C29.0121 9.26725 25.9326 11.5382 25.8613 11.5382C25.79 11.5382 22.7105 9.26725 19.0127 6.48502C15.3269 3.70278 12.0334 1.26536 11.7123 1.06323C10.3569 0.230937 8.06213 -0.197099 6.51644 0.088258ZM8.82308 4.63019C9.13222 4.72531 11.5459 6.46124 15.6835 9.57639C19.1911 12.2159 22.0684 14.4037 22.0803 14.4512C22.1279 14.582 14.1141 20.7172 13.912 20.7053C13.8168 20.7053 11.6291 19.0764 9.06088 17.0908L4.38815 13.4882L4.42382 10.2066L4.45949 6.92494L4.78052 6.33045C5.06588 5.7954 5.39879 5.40304 5.96951 4.975C6.57589 4.5113 7.91945 4.35673 8.82308 4.63019ZM45.0872 4.67775C45.8125 4.91555 46.5497 5.5695 46.9421 6.31856L47.2631 6.92494L47.2988 10.2066L47.3344 13.4882L42.6617 17.0908C40.0935 19.0764 37.9057 20.7053 37.7987 20.7053C37.5966 20.7172 29.5947 14.582 29.6423 14.4512C29.7017 14.2491 42.519 4.71342 42.8519 4.6183C43.4345 4.43996 44.4927 4.47563 45.0872 4.67775ZM30.0346 20.5032C32.2818 22.251 34.0891 23.7135 34.0415 23.7491C33.8632 23.9156 26.0991 29.8843 25.9683 29.9675C25.8375 30.0389 17.7167 23.868 17.6929 23.6778C17.6929 23.5827 25.6948 17.3405 25.8375 17.3405C25.897 17.3286 27.7875 18.7554 30.0346 20.5032ZM7.37252 21.4425C9.72671 23.2616 10.2142 23.6897 10.0834 23.8086C9.80994 24.082 4.51894 28.1484 4.45949 28.1484C4.42382 28.1484 4.40004 26.139 4.40004 23.6897C4.40004 21.2404 4.42382 19.231 4.4476 19.231C4.48327 19.231 5.80305 20.2297 7.37252 21.4425ZM47.3225 23.6897C47.3225 26.139 47.2988 28.1484 47.2631 28.1484C47.2274 28.1484 45.9195 27.1496 44.3501 25.9369C42.2456 24.308 41.5203 23.6778 41.6154 23.5827C41.8651 23.333 47.1442 19.2548 47.2393 19.2429C47.2869 19.231 47.3225 21.2404 47.3225 23.6897ZM20.3682 31.4776C21.3312 32.2147 22.116 32.8568 22.116 32.8925C22.1041 33.047 9.59592 42.4995 9.07277 42.7373C7.51519 43.4745 5.58903 42.7492 4.79241 41.1321L4.45949 40.4544L4.42382 37.1847L4.38815 33.9031L9.156 30.2053L13.9357 26.5076L16.2662 28.3148C17.5621 29.3017 19.3932 30.7285 20.3682 31.4776ZM42.6617 30.3005L47.3344 33.915L47.2988 37.2442L47.2631 40.5733L46.9421 41.1678C46.5378 41.9288 46.1217 42.3211 45.3013 42.7016C44.4452 43.1059 43.4583 43.1178 42.6498 42.7373C42.0197 42.4519 29.5947 33.0232 29.6423 32.8687C29.7017 32.6665 37.7631 26.5195 37.8701 26.6027C37.9414 26.6503 40.0935 28.303 42.6617 30.3005Z"
						fill="var(--text-color)"
					/>
					<path
						d="M120.255 8.16145C119.673 8.43492 118.983 9.20776 118.805 9.82604C118.484 10.8842 118.709 11.7998 119.47 12.5607C120.374 13.4643 121.563 13.6546 122.681 13.0958C124.785 12.0494 124.678 9.00564 122.502 8.09011C121.955 7.86421 120.838 7.89988 120.255 8.16145Z"
						fill="var(--text-color)"
					/>
					<path
						d="M214.613 19.7065V31.4775H216.801H219.001L219.036 26.8048C219.084 21.6446 219.084 21.6327 219.88 20.7885C220.427 20.2178 221.081 19.9443 221.926 19.9443C222.817 19.9443 223.507 20.2535 223.947 20.8123C224.565 21.6327 224.601 21.9656 224.601 26.9237V31.4775H226.8H229V26.0914C229 21.6446 228.964 20.5864 228.822 20.0038C228.382 18.2916 227.478 17.1145 226.087 16.4249C223.935 15.3667 221.414 15.6759 219.809 17.1978C219.452 17.5307 219.131 17.8042 219.096 17.8042C219.048 17.8042 219.013 15.5807 219.013 12.8699V7.93555H216.813H214.613V19.7065Z"
						fill="var(--text-color)"
					/>
					<path
						d="M188.574 13.6427V16.0207H187.088H185.602V17.9825V19.9443H187.076H188.563L188.598 23.8323C188.646 27.4587 188.67 27.7917 188.907 28.5051C189.383 29.9437 190.477 30.9781 191.963 31.43C192.819 31.6915 194.757 31.7629 195.827 31.5726L196.719 31.4181L196.755 29.6108L196.79 27.8154L195.482 27.7679C194.032 27.7322 193.723 27.6014 193.271 26.8286C193.045 26.4481 193.033 26.2103 193.033 23.2141V20.0038L194.971 19.9681L196.897 19.9443V17.9825V16.0207H194.935H192.974V13.6427V11.2647H190.774H188.574V13.6427Z"
						fill="var(--text-color)"
					/>
					<path
						d="M109.768 15.8423C106.82 16.3774 104.763 18.6959 105.048 21.1809C105.321 23.654 106.736 24.8192 110.196 25.4137C110.957 25.5445 111.813 25.7466 112.087 25.8417C113.775 26.46 113.145 28.3862 111.266 28.3862C110.089 28.3862 109.233 27.8511 108.829 26.8999C108.71 26.6027 108.532 26.3649 108.437 26.3649C108.341 26.3649 107.485 26.5789 106.534 26.8286C104.81 27.2804 104.81 27.2923 104.822 27.6252C104.87 28.6834 106.273 30.3837 107.652 31.0614C109.804 32.1196 112.8 32.0839 114.869 30.9901C115.796 30.4907 116.783 29.4206 117.104 28.5764C117.616 27.1972 117.544 25.6039 116.902 24.4268C116.141 23.0238 114.477 22.1797 111.778 21.8467C110.47 21.6803 109.673 21.4187 109.447 21.0977C108.936 20.3605 109.554 19.3261 110.612 19.1715C111.742 19.0051 112.574 19.3974 113.074 20.3367C113.24 20.6459 113.43 20.8955 113.49 20.8955C113.561 20.8955 114.417 20.6815 115.392 20.4318C117.425 19.9206 117.342 20.0157 116.759 18.8029C116.046 17.3167 114.405 16.1753 112.515 15.8423C111.385 15.6402 110.898 15.6402 109.768 15.8423Z"
						fill="var(--text-color)"
					/>
					<path
						d="M70.1511 15.9493C69.4496 16.1515 68.9146 16.4249 68.1655 16.9838L67.5353 17.4593V16.7341V16.0207H65.3357H63.1361V23.7491V31.4775H65.3952H67.6424L67.678 26.6265C67.7137 21.9299 67.7256 21.7754 67.9753 21.3117C68.4865 20.3605 69.2237 19.9443 70.3889 19.9443C71.5541 19.9443 72.2675 20.3961 72.7312 21.4306C72.9215 21.8586 72.9452 22.3937 72.9809 26.6859L73.0166 31.4775H75.2043H77.3921L77.4277 26.6265C77.4634 21.9299 77.4753 21.7754 77.725 21.3117C78.2362 20.3486 78.9734 19.9443 80.1624 19.9443C81.0304 19.9443 81.7557 20.2297 82.1361 20.7172C82.7068 21.4425 82.7544 21.9181 82.7544 26.8642V31.4775H85.0254H87.2963L87.2488 26.0914C87.2012 20.9431 87.1893 20.6815 86.9396 19.9324C86.4284 18.3749 85.4058 17.2216 83.8602 16.4487C82.9565 15.9969 81.9102 15.7829 80.5548 15.7829C78.7832 15.7829 77.5942 16.1515 76.5003 17.0432L76.0009 17.4356L75.561 17.0194C74.6574 16.1634 73.4684 15.7829 71.8276 15.7948C71.1974 15.7948 70.4484 15.8661 70.1511 15.9493Z"
						fill="var(--text-color)"
					/>
					<path
						d="M149.064 15.9018C148.434 16.0682 147.459 16.5676 146.877 17.0551L146.365 17.4593V16.746V16.0207H144.166H141.966V23.7491V31.4775H144.154H146.353L146.401 26.8048C146.425 23.7253 146.484 22.0013 146.579 21.7278C146.781 21.1333 147.4 20.4199 147.959 20.1702C148.624 19.873 149.801 19.873 150.384 20.1702C150.943 20.4556 151.169 20.7053 151.466 21.3711C151.704 21.8824 151.716 22.1321 151.716 26.6859V31.4775H153.975H156.234V26.8286C156.234 21.7873 156.258 21.5614 156.864 20.8242C157.363 20.2178 158.017 19.9443 158.98 19.9443C160.134 19.9443 160.704 20.2654 161.168 21.1928L161.525 21.9062L161.561 26.6859L161.596 31.4775H163.796H165.984V26.1509C165.984 20.3961 165.96 20.194 165.318 18.9218C164.628 17.5664 162.833 16.2704 161.133 15.9137C160.324 15.7472 158.445 15.7472 157.637 15.9137C156.793 16.092 155.913 16.52 155.306 17.0432L154.807 17.4712L154.201 16.9243C153.321 16.1277 152.536 15.878 150.883 15.8304C150.134 15.8067 149.314 15.8423 149.064 15.9018Z"
						fill="var(--text-color)"
					/>
					<path
						d="M173.95 15.8661C171.203 16.2823 168.849 18.4224 167.934 21.3236C167.232 23.5351 167.541 26.2103 168.742 28.2435C169.23 29.0758 170.49 30.3718 171.239 30.8117C172.583 31.5964 174.211 31.9056 175.924 31.7153C177.267 31.5727 178.385 31.2278 179.074 30.7641L179.598 30.4193L179.633 30.9425L179.669 31.4775H181.869H184.056V23.8086V16.1396H181.857H179.657V16.6746V17.2216L179.122 16.853C177.957 16.0563 175.614 15.6045 173.95 15.8661ZM177.113 20.0038C178.04 20.2891 178.813 20.955 179.3 21.8943C179.693 22.6552 179.716 22.786 179.716 23.7967C179.705 24.6408 179.657 24.9975 179.455 25.4375C179.098 26.2222 178.313 27.0188 177.529 27.3993C176.97 27.6847 176.72 27.7322 175.912 27.7203C175.127 27.7203 174.842 27.6609 174.283 27.3993C173.486 27.0069 172.844 26.3292 172.428 25.4256C171.976 24.4625 171.976 23.0238 172.428 22.0607C173.248 20.2891 175.21 19.4331 177.113 20.0038Z"
						fill="var(--text-color)"
					/>
					<path
						d="M203.615 15.9612C200.607 16.6152 198.181 18.9575 197.432 21.9062C197.004 23.5708 197.29 25.9725 198.11 27.649C198.669 28.7904 200.215 30.3123 201.416 30.9068C202.902 31.6202 203.615 31.7748 205.577 31.7629C207.099 31.7629 207.408 31.7272 208.217 31.4538C210.369 30.7404 211.831 29.5276 212.723 27.7441C213.02 27.1258 213.186 26.674 213.115 26.6146C212.996 26.4957 209.501 25.4137 209.251 25.4137C209.156 25.4137 209.013 25.5564 208.942 25.7347C208.656 26.3768 208.062 26.9475 207.301 27.328C206.635 27.6609 206.409 27.7084 205.577 27.7084C204.745 27.7084 204.531 27.6609 203.853 27.328C201.094 25.9606 201.118 21.5733 203.889 20.2178C204.471 19.9325 204.709 19.8849 205.577 19.8849C206.362 19.8849 206.718 19.9443 207.135 20.1465C207.8 20.4437 208.538 21.1571 208.823 21.7516L209.025 22.1915L209.596 22.0132C209.905 21.9181 210.809 21.6446 211.617 21.4068L213.079 20.9669L212.996 20.6102C212.961 20.408 212.735 19.8849 212.509 19.445C211.665 17.8161 209.715 16.4368 207.634 15.9731C206.599 15.7472 204.614 15.7353 203.615 15.9612Z"
						fill="var(--text-color)"
					/>
					<path
						d="M119.256 23.7491V31.4775H121.456H123.656V23.7491V16.0207H121.456H119.256V23.7491Z"
						fill="var(--text-color)"
					/>
					<path
						d="M125.082 16.0801C125.082 16.1158 126.283 17.8517 127.746 19.9443L130.409 23.7491L127.686 27.5539C126.188 29.6584 124.964 31.3943 124.964 31.4181C124.964 31.4537 126.057 31.4775 127.401 31.4775H129.838L131.277 29.2779C132.074 28.0651 132.763 27.0783 132.811 27.0783C132.858 27.0783 133.548 28.0651 134.333 29.2779L135.771 31.4775H138.28H140.801L140.385 30.9068C138.661 28.5407 135.308 23.7372 135.308 23.6421C135.308 23.5826 136.473 21.9062 137.9 19.9206C139.326 17.9231 140.539 16.2347 140.587 16.1634C140.646 16.0563 140.087 16.0207 138.221 16.0207H135.771L134.333 18.2203C133.548 19.4212 132.858 20.3961 132.823 20.3724C132.787 20.3486 132.133 19.3498 131.384 18.1727L130.017 16.0207H127.556C126.188 16.0207 125.082 16.0445 125.082 16.0801Z"
						fill="var(--text-color)"
					/>
					<path
						d="M88.9728 21.0382C89.0323 26.5076 89.0679 26.7929 89.8527 28.291C90.9228 30.3361 93.051 31.6083 95.7144 31.7986C98.5561 32.0007 101.41 30.5501 102.575 28.3267C103.336 26.8643 103.36 26.6978 103.407 21.1571L103.455 16.1396H101.196H98.9246V20.8123C98.9246 26.1033 98.9009 26.2698 98.0924 27.0069C97.0579 27.9343 95.2269 27.8987 94.2638 26.9356C93.491 26.1627 93.4553 25.8655 93.4553 20.6934V16.1396H91.1843H88.9134L88.9728 21.0382Z"
						fill="var(--text-color)"
					/>
				</svg>
			),
		},
		{
			id: 'logo3',
			url: 'https://www.wistia.com/',
			light: (
				<svg
					height="30"
					viewBox="0 0 165 36"
					fill="none"
					className="-mt-2"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M16.4128 26.0434H11.2775C9.66644 26.0434 8.15605 26.4461 7.04844 27.6544L0.302047 35.4078C5.23597 35.7098 10.3713 35.7098 13.9962 35.7098C32.4229 35.7098 35.343 24.6337 35.4437 19.0956C33.8326 21.1094 28.9994 26.0434 16.4128 26.0434ZM33.1278 8.22082C33.0271 9.12705 32.5236 13.0541 21.4474 13.0541C12.4858 13.0541 8.8609 13.054 -3.05176e-05 12.8527L6.64567 20.5053C7.95467 22.0157 9.76713 22.5191 11.781 22.6198C13.9962 22.6198 17.017 22.7205 17.4198 22.7205C29.8049 22.7205 35.0409 16.9811 35.0409 12.8527C35.1416 10.6374 34.4368 9.22774 33.1278 8.22082Z"
						fill="var(--light-text-color)"
					/>
					<path
						d="M68.0509 9.70953H75.3052V27.0081C75.3052 28.9054 74.8588 30.5795 74.0776 31.9187C73.2963 33.258 72.2919 34.1508 70.9526 34.8204C69.6134 35.49 68.1625 35.7132 66.4885 35.7132C64.8144 35.7132 63.3636 35.3784 62.0243 34.8204C60.6851 34.1508 59.6807 33.258 58.8994 31.9187C58.7878 31.8071 58.7878 31.5839 58.6762 31.4723C58.5646 31.5839 58.5646 31.8071 58.453 31.9187C57.6718 33.258 56.6673 34.1508 55.3281 34.8204C53.9889 35.49 52.538 35.7132 50.8639 35.7132C49.1899 35.7132 47.739 35.3784 46.5114 34.8204C45.1722 34.1508 44.1677 33.258 43.3865 31.9187C42.6053 30.5795 42.2704 29.017 42.2704 27.0081L42.0472 9.70953H49.3015V25.6689C49.3015 26.7849 49.5247 27.5662 50.0827 28.0126C50.6407 28.459 51.3104 28.6822 52.0916 28.6822C52.8728 28.6822 53.654 28.459 54.2121 28.0126C54.7701 27.5662 55.1049 26.7849 55.1049 25.6689V9.70953H57.7834H59.6807H62.3592V25.6689C62.3592 26.7849 62.694 27.5662 63.252 28.0126C63.81 28.459 64.5912 28.6822 65.3725 28.6822C66.1537 28.6822 66.8233 28.459 67.3813 28.0126C67.8277 27.5662 68.0509 26.7849 68.0509 25.6689V9.70953ZM85.796 0.446408C85.2379 0.111596 84.5683 -7.62939e-06 83.7871 -7.62939e-06C83.0059 -7.62939e-06 82.3362 0.111596 81.7782 0.446408C81.2202 0.78122 80.6622 1.22764 80.3274 1.78565C79.9926 2.34367 79.7694 3.0133 79.7694 3.68292C79.7694 4.79896 80.1042 5.69179 80.8854 6.36141C81.6666 7.03104 82.6711 7.36585 83.7871 7.36585C84.5683 7.36585 85.2379 7.25425 85.796 6.91943C86.4656 6.58462 86.912 6.13821 87.2468 5.58019C87.5816 5.02217 87.8048 4.35254 87.8048 3.57132C87.8048 2.79009 87.5816 2.23207 87.2468 1.67405C86.912 1.22764 86.4656 0.78122 85.796 0.446408ZM80.1042 35.1552H87.3584V10.0443H80.1042V35.1552ZM104.211 23.4368C103.876 22.8788 103.318 22.3208 102.871 21.7628C102.425 21.3163 101.867 20.8699 101.309 20.3119C100.862 19.8655 100.528 19.5307 100.193 19.1959C99.9697 18.8611 99.8581 18.5262 99.8581 18.0798C99.8581 17.4102 100.193 16.9638 100.974 16.629C101.755 16.2942 102.648 16.1826 103.764 16.1826H104.88L104.211 9.48632C103.541 9.37472 102.871 9.37472 102.202 9.37472C100.416 9.37472 98.742 9.59793 97.068 10.0443C95.5055 10.4908 94.1663 11.272 93.1618 12.388C92.1574 13.5041 91.5994 14.9549 91.5994 16.8522C91.5994 18.1914 91.8226 19.3075 92.3806 20.3119C92.9386 21.3163 93.6082 22.2092 94.3895 23.102C94.8359 23.5484 95.2823 23.9948 95.7287 24.4412C96.1751 24.8877 96.6215 25.3341 96.8448 25.6689C97.068 26.0037 97.1796 26.3385 97.1796 26.7849C97.1796 27.4546 96.8447 28.0126 96.0635 28.3474C95.2823 28.6822 94.2779 28.9054 92.827 28.9054C92.269 28.9054 91.8226 28.9054 91.5994 28.7938L92.4922 35.49C93.1618 35.7132 93.7198 35.7132 94.5011 35.7132C96.6215 35.7132 98.4072 35.3784 100.081 34.8204C101.755 34.2624 103.095 33.3696 104.099 32.1419C105.103 30.9143 105.55 29.4634 105.55 27.5662C105.55 26.7849 105.438 26.0037 105.215 25.2225C104.88 24.5529 104.657 23.9948 104.211 23.4368ZM117.491 28.0126C116.933 27.4546 116.71 26.6733 116.71 25.6689V16.4058H121.956V10.0443H116.71V3.68292L109.456 5.8034V28.0126C109.456 30.5795 110.014 32.5883 111.018 33.816C112.134 35.0436 113.697 35.7132 115.817 35.7132C116.933 35.7132 117.938 35.6016 118.942 35.49C119.947 35.3784 120.728 35.1552 121.509 34.8204L122.848 28.5706C122.067 28.7938 121.063 28.9054 119.947 28.9054C118.719 28.7938 117.938 28.5706 117.491 28.0126ZM126.531 35.1552H133.786V10.0443H126.531V35.1552ZM132.223 0.446408C131.665 0.111596 130.996 -7.62939e-06 130.214 -7.62939e-06C129.433 -7.62939e-06 128.763 0.111596 128.205 0.446408C127.647 0.78122 127.089 1.22764 126.755 1.78565C126.42 2.34367 126.197 3.0133 126.197 3.68292C126.197 4.79896 126.531 5.69179 127.313 6.36141C128.094 7.03104 129.098 7.36585 130.214 7.36585C130.996 7.36585 131.665 7.25425 132.223 6.91943C132.893 6.58462 133.339 6.13821 133.674 5.58019C134.009 5.02217 134.232 4.35254 134.232 3.57132C134.232 2.79009 134.009 2.23207 133.674 1.67405C133.339 1.22764 132.893 0.78122 132.223 0.446408ZM164.477 10.0443V35.1552H157.222V31.0259C156.441 32.2535 155.548 33.258 154.432 34.0392C152.87 35.1552 150.973 35.7132 148.852 35.7132C146.732 35.7132 144.834 35.1552 143.272 34.0392C141.71 32.9231 140.482 31.3607 139.589 29.3518C138.696 27.3429 138.25 25.1109 138.25 22.544C138.25 19.9771 138.696 17.745 139.589 15.8477C140.482 13.8389 141.71 12.2764 143.272 11.1604C144.834 10.0443 146.732 9.48632 148.852 9.48632C150.973 9.48632 152.87 10.0443 154.432 11.1604C155.548 11.9416 156.441 12.946 157.222 14.1737V10.0443H164.477ZM156.664 25.6689C157.222 24.7761 157.446 23.66 157.446 22.544C157.446 21.4279 157.222 20.3119 156.664 19.4191C156.218 18.5262 155.548 17.745 154.656 17.2986C153.763 16.7406 152.87 16.5174 151.754 16.5174C150.749 16.5174 149.745 16.7406 148.852 17.2986C147.959 17.8566 147.29 18.5262 146.843 19.4191C146.285 20.3119 146.062 21.3163 146.062 22.544C146.062 23.66 146.285 24.7761 146.843 25.6689C147.401 26.5617 148.071 27.3429 148.852 27.7894C149.745 28.3474 150.638 28.5706 151.754 28.5706C152.758 28.5706 153.763 28.3474 154.656 27.7894C155.548 27.3429 156.218 26.5617 156.664 25.6689Z"
						fill="var(--text-color)"
					/>
				</svg>
			),
		},
		{
			id: 'logo4',
			url: 'https://www.vicemediagroup.com/',
			light: (
				<svg
					height="20"
					viewBox="0 0 190 20"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M43.4416 0.472096C37.9752 0.662593 33.9996 3.1639 32.8566 7.12292C32.5171 8.27419 32.4425 8.96992 32.4922 10.4111C32.5171 11.4547 32.575 11.8853 32.7407 12.5148C33.5441 15.5628 35.5319 17.6334 38.7372 18.7432C40.402 19.3313 41.9508 19.5549 44.1871 19.5549C48.9909 19.5549 52.5027 18.0724 54.3165 15.2977C54.6644 14.7676 55.2442 13.4342 55.2442 13.1608C55.2442 13.1194 54.4987 13.0863 53.3806 13.0863H51.5171L51.1858 13.6164C50.3327 14.9664 48.8501 15.8858 46.8375 16.3248C45.8518 16.5401 43.7067 16.6229 42.63 16.4904C39.7808 16.1343 37.7764 14.9167 36.8157 12.9621C36.4181 12.1587 36.269 11.5458 36.2193 10.4608C35.9957 6.06277 38.9857 3.47863 44.2699 3.47863C47.3841 3.47863 49.7612 4.4891 50.9787 6.32781L51.2934 6.79163H53.2232C54.2917 6.79163 55.1613 6.77506 55.1613 6.76678C55.1613 6.75021 55.0951 6.53487 55.004 6.28639C53.803 2.79119 50.0428 0.654311 44.8083 0.480378C44.3776 0.463815 43.7647 0.463815 43.4416 0.472096Z"
						fill="var(--text-color)"
					/>
					<path
						d="M0.331299 0.745421C0.331299 0.828246 9.89756 18.7847 10.1543 19.1988C10.2703 19.381 10.2951 19.381 12.2167 19.381H14.163L14.3535 19.0745C14.6103 18.6604 24.102 0.786833 24.102 0.71229C24.102 0.687443 23.2241 0.662594 22.1556 0.662594H20.2092L20.0436 0.927634C19.9608 1.07672 18.1635 4.50566 16.0597 8.54751C13.956 12.5976 12.2084 15.8775 12.1752 15.8444C12.1421 15.8112 10.3779 12.4237 8.24935 8.32389C6.11247 4.22406 4.33174 0.819962 4.29032 0.761984C4.18265 0.629466 0.331299 0.6129 0.331299 0.745421Z"
						fill="var(--text-color)"
					/>
					<path
						d="M26.0484 0.761964C26.0236 0.819942 26.0153 5.02744 26.0236 10.1046L26.0484 19.3396H27.8291H29.6099V10.0218V0.703989L27.8457 0.67914C26.4874 0.662576 26.0732 0.67914 26.0484 0.761964Z"
						fill="var(--text-color)"
					/>
					<path
						d="M57.8945 10.0218V19.381L67.2786 19.3644L76.6543 19.3396L76.6792 17.9067L76.6958 16.4821H69.0759H61.456V13.9146V11.347H68.289H75.1221V9.93897V8.53095H68.289H61.456V6.04621V3.56146H69.0759H76.6958L76.6792 2.1286L76.6543 0.70401L67.2786 0.679162L57.8945 0.662598V10.0218Z"
						fill="var(--text-color)"
					/>
					<path
						d="M87.5458 10.0218V19.381H88.7881H90.0305L90.0471 11.6534L90.0719 3.91761L94.3126 11.6286L98.5449 19.3396L99.8784 19.3644L101.212 19.381L101.353 19.1491C101.435 19.0166 103.349 15.5545 105.602 11.4464L109.701 3.98387L109.743 11.6617L109.784 19.3396H111.027H112.269V10.0218V0.70401L110.513 0.679162L108.765 0.662598L108.608 0.886223C108.517 1.01874 106.529 4.61334 104.194 8.87881C101.85 13.1526 99.9115 16.6478 99.8867 16.6478C99.8618 16.6478 97.8906 13.0615 95.497 8.67175L91.1487 0.70401L89.3514 0.679162L87.5458 0.662598V10.0218Z"
						fill="var(--text-color)"
					/>
					<path
						d="M115.996 0.761986C115.971 0.819964 115.963 5.02746 115.971 10.1046L115.996 19.3396L125.173 19.3644L134.342 19.381V18.2629V17.1447H126.473H118.605V14.0802V11.0157H125.687H132.768V9.93897V8.86225H125.687H118.605V5.88056V2.89887H126.473H134.342V1.78073V0.662598H125.19C117.942 0.662598 116.021 0.687445 115.996 0.761986Z"
						fill="var(--text-color)"
					/>
					<path
						d="M137.531 0.761966C137.506 0.819944 137.497 5.02744 137.506 10.1046L137.531 19.3396H143.245C149.366 19.3396 149.789 19.3147 151.503 18.8757C156.067 17.7245 158.593 14.5689 158.609 10.0218C158.609 9.59109 158.551 8.87879 158.493 8.44811C157.922 4.67958 155.528 2.18655 151.503 1.16781C149.83 0.745403 149.499 0.720554 143.353 0.687425C138.591 0.654294 137.564 0.67086 137.531 0.761966ZM149.184 3.10591C151.42 3.39579 152.952 4.09981 154.162 5.38359C155.305 6.60111 155.793 7.976 155.793 10.0218C155.793 12.0675 155.305 13.4424 154.162 14.66C152.952 15.9437 151.42 16.6478 149.184 16.9376C148.463 17.037 147.304 17.0619 144.19 17.0619H140.139V10.0218V2.98167H144.19C147.304 2.98167 148.463 3.00652 149.184 3.10591Z"
						fill="var(--text-color)"
					/>
					<path
						d="M161.384 0.761964C161.359 0.819942 161.351 5.02744 161.359 10.1046L161.384 19.3396H162.668H163.952V10.0218V0.703989L162.684 0.67914C161.724 0.662576 161.409 0.67914 161.384 0.761964Z"
						fill="var(--text-color)"
					/>
					<path
						d="M176.268 0.770262C176.177 0.877934 166.503 19.0497 166.42 19.265C166.378 19.3644 166.569 19.381 167.728 19.3644L169.087 19.3396L170.462 16.772L171.837 14.2044H178.082H184.326L185.693 16.772L187.068 19.3396L188.368 19.3644C189.238 19.381 189.669 19.3561 189.669 19.2982C189.669 19.2153 180.194 1.27549 179.929 0.844805C179.813 0.662591 179.779 0.662591 178.082 0.662591C176.781 0.662591 176.334 0.687438 176.268 0.770262ZM180.649 7.23888C181.991 9.74019 183.101 11.8191 183.109 11.8605C183.126 11.8936 180.864 11.9268 178.082 11.9268C175.299 11.9268 173.021 11.9102 173.021 11.8853C173.021 11.8605 174.147 9.7319 175.522 7.15605C177.493 3.4455 178.04 2.5013 178.115 2.58413C178.173 2.6421 179.307 4.73757 180.649 7.23888Z"
						fill="var(--text-color)"
					/>
				</svg>
			),
		},
		{
			id: 'logo5',
			url: 'https://www.soundcloud.com/',
			light: (
				<svg
					height="40"
					viewBox="0 0 129 57"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M68.962 1.89524C67.7646 2.35781 67.4474 2.83682 67.4351 3.75787V54.1228C67.4597 55.093 68.2007 55.9034 69.1483 55.9976C69.1893 55.9996 112.847 56.0222 113.134 56.0222C121.898 56.0222 129 48.9199 129 40.1536C129 31.3872 121.898 24.287 113.134 24.287C111.027 24.286 108.941 24.7042 106.997 25.5171C105.734 11.2183 93.7445 -2.25304e-06 79.1141 -2.25304e-06C75.643 0.00545336 72.2022 0.649256 68.964 1.89936M62.4471 5.46073L61.7308 41.2056L62.4471 54.1781C62.4717 55.1257 63.2454 55.9055 64.1951 55.9055C64.6562 55.9018 65.0976 55.7172 65.4241 55.3915C65.7506 55.0657 65.9362 54.6249 65.941 54.1637V54.1761L66.7188 41.2036L65.941 5.45461C65.9165 4.49876 65.1427 3.7149 64.1951 3.7149C63.2474 3.7149 62.4553 4.50079 62.4471 5.46073ZM57.1398 8.42858L56.5259 41.1913C56.5259 41.2118 57.1398 54.3643 57.1398 54.3643C57.1643 55.2547 57.889 55.9875 58.7773 55.9875C59.2089 55.9827 59.6215 55.8099 59.9276 55.5056C60.2338 55.2014 60.4094 54.7897 60.4168 54.3582L61.1064 41.2036L60.4168 8.42645C60.3923 7.52996 59.6656 6.7993 58.7793 6.7993C58.3481 6.80456 57.9359 6.97771 57.6302 7.28189C57.3245 7.58607 57.1495 7.99738 57.142 8.42858M41.2713 11.863L40.4588 41.1933L41.2733 54.6611C41.2938 55.3816 41.8872 55.9506 42.579 55.9506C43.2708 55.9506 43.8625 55.3775 43.885 54.655V54.6488L44.7999 41.1913L43.885 11.861C43.8604 11.1303 43.2872 10.5613 42.579 10.5613C41.8708 10.5613 41.2898 11.1303 41.2693 11.861M46.5171 12.6122L45.7721 41.1953L46.5191 54.5301C46.5437 55.314 47.1577 55.9343 47.9375 55.9343C48.7174 55.9343 49.3294 55.312 49.3539 54.522V54.5301L50.1727 41.1933L49.3539 12.6101C49.3294 11.818 48.7112 11.1978 47.9375 11.1978C47.1639 11.1978 46.5356 11.82 46.5171 12.6101M36.0642 12.8148L35.1842 41.1892L36.0642 54.7388C36.0711 55.0527 36.1999 55.3516 36.4234 55.5721C36.647 55.7926 36.9477 55.9173 37.2617 55.9199C37.9064 55.9199 38.4324 55.402 38.459 54.7327L39.4496 41.1892L38.459 12.8127C38.4324 12.1475 37.9064 11.6257 37.2617 11.6257C36.9467 11.6283 36.6451 11.7538 36.4214 11.9756C36.1978 12.1974 36.0695 12.4978 36.0642 12.8127M51.808 13.6561L51.1244 41.1933L51.808 54.4461C51.8325 55.2915 52.4979 55.9567 53.3371 55.9567C54.1762 55.9567 54.8435 55.2915 54.8619 54.438V54.4483L55.6272 41.1953L54.8619 13.6539C54.8581 13.2511 54.6962 12.8658 54.4109 12.5813C54.1256 12.2968 53.7399 12.1359 53.3371 12.1332C52.5184 12.1332 51.8223 12.8026 51.808 13.6561ZM30.8982 14.9946C30.8982 14.9967 29.9566 41.1831 29.9566 41.1831L30.8982 54.8719C30.9066 55.1562 31.0241 55.4263 31.2266 55.6261C31.429 55.8258 31.7008 55.9398 31.9851 55.9444C32.5643 55.9444 33.041 55.4736 33.0697 54.8678L34.1341 41.1831L33.0697 14.9946C33.039 14.3908 32.5623 13.918 31.9851 13.918C31.7001 13.9227 31.4278 14.0372 31.2253 14.2378C31.0228 14.4385 30.9056 14.7097 30.8982 14.9946ZM25.7751 19.866L24.7659 41.1831L25.7751 54.9578C25.8017 55.4961 26.2296 55.9199 26.7515 55.9199C27.0066 55.9138 27.2498 55.8107 27.4316 55.6316C27.6133 55.4525 27.7198 55.2108 27.7296 54.9558V54.96L28.872 41.1851L27.7296 19.868C27.6969 19.3276 27.2673 18.9019 26.7515 18.9019C26.2357 18.9019 25.8017 19.3256 25.7751 19.866ZM15.6516 27.0563L14.5138 41.179L15.6516 54.8412C15.6844 55.2648 16.008 55.5821 16.4092 55.5821C16.8103 55.5821 17.1296 55.2648 17.1665 54.8412L18.4559 41.179L17.1665 27.0522C17.1296 26.6326 16.8062 26.3112 16.4092 26.3112C16.0121 26.3112 15.6823 26.6306 15.6516 27.0563ZM10.6514 27.4308C10.6514 27.4329 9.44385 41.177 9.44385 41.177L10.6514 54.4195C10.6882 54.788 10.9585 55.0337 11.2982 55.0337C11.638 55.0337 11.9042 54.7676 11.9431 54.3992L13.3103 41.1565L11.9451 27.4103C11.9042 27.0419 11.6319 26.7758 11.2982 26.7758C10.9646 26.7758 10.6841 27.0419 10.6514 27.4103M20.6929 28.0592L19.6205 41.1585L20.6929 54.9334C20.7256 55.4184 21.0942 55.7888 21.5588 55.7888C22.0235 55.7888 22.3898 55.4204 22.4246 54.9354L23.6423 41.1606L22.4246 28.0531C22.3877 27.5721 22.0194 27.2057 21.5588 27.2057C21.0983 27.2057 20.7236 27.57 20.6929 28.0592ZM5.69409 29.5738C5.69409 29.5758 4.4251 41.1585 4.4251 41.1585L5.69409 52.4894C5.73093 52.7924 5.9603 53.0094 6.23252 53.0094C6.50474 53.0094 6.72376 52.7965 6.7647 52.4916L8.20559 41.1585L6.7647 29.5738C6.71762 29.2668 6.49869 29.0539 6.22852 29.0539C5.95835 29.0539 5.72693 29.2729 5.69009 29.5738M0.941686 33.9948L0 41.1585L0.941686 48.1994C0.978528 48.4962 1.19125 48.705 1.45938 48.705C1.7275 48.705 1.93013 48.4962 1.97107 48.2015L3.08865 41.1565L1.97107 33.9928C1.93013 33.698 1.71727 33.4913 1.45938 33.4913C1.20148 33.4913 0.976481 33.7 0.941686 33.9948Z"
						fill="var(--text-color)"
					/>
				</svg>
			),
		},
	];

	return (
		<>
			<h3 className={'text-center mt-20'}>Trusted by</h3>
			<div
				className={
					'text-center flex flex-nowrap justify-center items-center gap-10 mb-20'
				}
			>
				{logos.map((logo) => (
					<a
						key={logo.id}
						href={logo.url}
						target="_blank"
						className="opacity-80 hover:opacity-100 transition-opacity"
					>
						{logo.light}
					</a>
				))}
			</div>
		</>
	);
};

export default TrustedByBanner;
