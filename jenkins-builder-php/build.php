<?php
	class build{
		function deploy(){

			$this->updateBuildInfo();

			$cmdArgs = array(
				"-avz",
				"-e",
				"'ssh -i /var/lib/jenkins-php-libs/sshKeys/jakesiegers'",
				"--delete",
				"--exclude=jenkins-builder-php/",
				"--exclude=project-files/",
				"--exclude=.gitignore/",
				"--exclude=.git/",
				".",
				//I assume this won't change. If it does, the build will stop. I feel better putting a absolute URL instead of relative one.
				"u43111589@jakesiegers.com:/kunden/homepages/13/d185963174/htdocs/jakeisa.ninja/audioapi/"
			);
			print_r($cmdArgs);
			$rsyncCommand="rsync ".implode(" ",$cmdArgs);
			print_r($rsyncCommand);
			$output;
			$returnVar;
			exec($rsyncCommand,$output,$returnVar);
			echo implode("\n",$output);
			return $this->exitCode($returnVar);
		}

		private function updateBuildInfo(){

			$buildString = "J".$_SERVER['BUILD_NUMBER'];

			file_put_contents("js/buildInfo.js", 'buildInfo = "'.$buildString.'";');
		}

		private function exitCode($returnVar){
			switch($returnVar){
				case 0:
					echo 'Success';
					break;
				case 1:
					echo 'Syntax or usage error';
					break;
				case 2:
					echo 'Protocol incompatibility';
					break;
				case 3:
					echo 'Errors selecting input/output files, dirs';
					break;
				case 4:
					echo 'Requested  action not supported: an attempt was made to manipulate 64-bit files on a platform that cannot support them; or an option was specified that is supported by the client and not by the server.';
					break;
				case 5:
					echo 'Error starting client-server protocol';
					break;
				case 6:
					echo 'Daemon unable to append to log-file';
					break;
				case 10:
					echo 'Error in socket I/O';
					break;
				case 11:
					echo 'Error in file I/O';
					break;
				case 12:
					echo 'Error in rsync protocol data stream';
					break;
				case 13:
					echo 'Errors with program diagnostics';
					break;
				case 14:
					echo 'Error in IPC code';
					break;
				case 20:
					echo 'Received SIGUSR1 or SIGINT';
					break;
				case 21:
					echo 'Some error returned by waitpid()';
					break;
				case 22:
					echo 'Error allocating core memory buffers';
					break;
				case 23:
					echo 'Partial transfer due to error';
					break;
				case 24:
					echo 'Partial transfer due to vanished source files';
					break;
				case 25:
					echo 'The --max-delete limit stopped deletions';
					break;
				case 30:
					echo 'Timeout in data send/receive';
					break;
				case 35:
					echo 'Timeout waiting for daemon connection';
					break;
			}
			echo "\n";
			return $returnVar;
		}
	}
?>