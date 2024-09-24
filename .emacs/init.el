(defun my-limo-restore-windows ()
	"Deletes all other windows and shows tests in side window"
	(interactive)
	(neotree-hide)
	(delete-other-windows)
	(split-window-horizontally -25)
	(other-window 1)
	(switch-to-buffer "limo test watch")
	(other-window 1))

(global-set-key (kbd "C-x 9") 'my-limo-restore-windows)

(defun my-shell (command)
	"Executes the command in a new shell"
	(interactive "P")
	(if (eq system-type 'windows-nt)
			(progn
				(shell)
				(switch-to-buffer "*shell*")
				(goto-char (point-max))
				(insert command)
				(comint-send-input nil t))
		(term command)))

(unless (get-buffer "limo test watch")
	(delete-other-windows)
	(split-window-horizontally -20)
	(other-window 1)
	(cd (projectile-project-root))
	(my-shell "npx ava --watch")
	(rename-buffer "limo test watch")
	(other-window 1))

(magit-fetch-all-prune)
